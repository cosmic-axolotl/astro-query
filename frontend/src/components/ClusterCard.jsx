import { useState } from 'react';
import ListItemModal from './ListItemModal';
import { getObjectTypeInfo } from '../utils/objectTypes';

const CLUSTER_TYPES = {
    'OpC': { label: 'Aglomerado Aberto', desc: 'Grupo de estrelas jovens formadas da mesma nuvem molecular, fracamente ligadas gravitacionalmente.' },
    'GlC': { label: 'Aglomerado Globular', desc: 'Esfera densa de centenas de milhares de estrelas antigas, fortemente ligadas pela gravidade.' },
    'Cl*': { label: 'Aglomerado Estelar', desc: 'Grupo de estrelas gravitacionalmente ligadas.' },
    'As*': { label: 'Associação Estelar', desc: 'Grupo frouxo de estrelas jovens da mesma região de formação, se dispersando gradualmente.' },
};

function clusterTypeInfo(t = '') {
    return CLUSTER_TYPES[t] || { label: t, desc: `Tipo de objeto SIMBAD: ${t}` };
}

function Tooltip({ text, children }) {
    const [show, setShow] = useState(false);
    return (
        <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <div style={{
                    position: 'absolute', top: '140%', right: 0,
                    background: '#06111e',
                    border: '1px solid #2a5a7a',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    width: '260px',
                    zIndex: 200,
                    pointerEvents: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                }}>
                    <div style={{
                        position: 'absolute', bottom: '100%', right: '20px',
                        borderLeft: '7px solid transparent',
                        borderRight: '7px solid transparent',
                        borderBottom: '7px solid #2a5a7a',
                    }} />
                    <div style={{
                        color: '#4af5c2', fontFamily: 'monospace', fontSize: '12px',
                        marginBottom: '6px', fontWeight: 'bold', letterSpacing: '0.05em',
                    }}>
                        {text.label}
                    </div>
                    <div style={{
                        color: '#8ab8d8', fontFamily: 'Georgia, serif', fontSize: '12px',
                        lineHeight: '1.6',
                    }}>
                        {text.desc}
                    </div>
                </div>
            )}
        </div>
    );
}

function MemberTooltip({ text, children }) {
    const [show, setShow] = useState(false);
    return (
        <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <div style={{
                    position: 'absolute', bottom: '140%', left: 0,
                    background: '#06111e',
                    border: '1px solid #2a5a7a',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    width: '220px',
                    zIndex: 200,
                    pointerEvents: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                }}>
                    <div style={{
                        position: 'absolute', top: '100%', left: '16px',
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid #2a5a7a',
                    }} />
                    <div style={{ color: '#4a9fd4', fontFamily: 'monospace', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>
                        {text.label}
                    </div>
                    <div style={{ color: '#8ab8d8', fontFamily: 'Georgia, serif', fontSize: '11px', lineHeight: '1.5' }}>
                        {text.desc}
                    </div>
                </div>
            )}
        </div>
    );
}

function MemberCard({ obj, onClick, selected }) {
    const typeInfo = getObjectTypeInfo(obj.object_type);
    return (
        <div
            onClick={onClick}
            style={{
                background: selected ? '#06101c' : '#040b14',
                border: `1px solid ${selected ? '#1e4a7a' : '#0e2540'}`,
                borderLeft: '3px solid #4a9fd4',
                borderRadius: '4px',
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#05101a'; }}
            onMouseLeave={e => { e.currentTarget.style.background = selected ? '#06101c' : '#040b14'; }}
        >
            <div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: '#d8eeff' }}>
                    {obj.name}
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '4px', alignItems: 'center' }}>
                    <MemberTooltip text={typeInfo}>
                        <span style={{
                            color: '#3a6a8a', fontFamily: 'monospace', fontSize: '10px',
                            border: '1px solid #1a3a5a', padding: '1px 6px', borderRadius: '2px',
                            cursor: 'help',
                        }}>
                            {obj.object_type}
                        </span>
                    </MemberTooltip>
                    {obj.spectral_type && (
                        <span style={{ color: '#6a8ab8', fontFamily: 'monospace', fontSize: '10px' }}>
                            · {obj.spectral_type}
                        </span>
                    )}
                </div>
            </div>
            <div style={{ display: 'flex', gap: '14px', textAlign: 'right', flexShrink: 0 }}>
                {obj.apparent_magnitude != null && (
                    <div>
                        <div style={{ color: '#1a4a6a', fontFamily: 'monospace', fontSize: '9px' }}>MAG</div>
                        <div style={{ color: '#c8f542', fontFamily: 'monospace', fontSize: '12px' }}>
                            {obj.apparent_magnitude}
                        </div>
                    </div>
                )}
                {obj.distance_ly != null && (
                    <div>
                        <div style={{ color: '#1a4a6a', fontFamily: 'monospace', fontSize: '9px' }}>DIST</div>
                        <div style={{ color: '#f5c542', fontFamily: 'monospace', fontSize: '12px' }}>
                            {obj.distance_ly > 1000
                                ? `${(obj.distance_ly / 1000).toFixed(1)}k`
                                : obj.distance_ly} ly
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ClusterCard({ data }) {
    const [selectedMember, setSelectedMember] = useState(null);
    const [showAll, setShowAll] = useState(false);

    const cluster = data.cluster;
    const members = data.members ?? [];
    const displayed = showAll ? members : members.slice(0, 20);
    const typeInfo = clusterTypeInfo(cluster.object_type);

    return (
        <div style={{
            background: '#050d18',
            border: '1px solid #1a3050',
            borderLeft: '3px solid #4af5c2',
            borderRadius: '6px',
            padding: '28px',
            marginTop: '20px',
            position: 'relative',
            overflow: 'hidden',
        }}>

            {/* Glow */}
            <div style={{
                position: 'absolute', top: 0, right: 0,
                width: '180px', height: '180px',
                background: 'radial-gradient(circle at top right, #4af5c218, transparent 70%)',
                pointerEvents: 'none',
            }} />

            {/* Header */}
            <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                        <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '30px', color: '#e8f4ff' }}>
                            {cluster.name}
                        </h2>
                        {cluster.aliases?.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                                {cluster.aliases.slice(0, 4).map((a, i) => (
                                    <span key={i} style={{ color: '#3a6a8a', fontFamily: 'monospace', fontSize: '12px' }}>{a}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tag com tooltip */}
                    <Tooltip text={typeInfo}>
                        <span style={{
                            color: '#4af5c2', border: '1px solid #4af5c244',
                            padding: '4px 14px', fontFamily: 'monospace',
                            fontSize: '12px', borderRadius: '3px', cursor: 'help',
                            background: '#4af5c211',
                        }}>
                            {typeInfo.label}
                        </span>
                    </Tooltip>
                </div>

                {/* Dados do aglomerado */}
                <div style={{ display: 'flex', gap: '28px', marginTop: '16px', flexWrap: 'wrap' }}>
                    {cluster.coordinates && (
                        <div>
                            <div style={{ color: '#3a7a9a', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.15em', marginBottom: '4px' }}>
                                COORDENADAS
                            </div>
                            <div style={{ color: '#7ad4f5', fontFamily: 'monospace', fontSize: '12px' }}>
                                RA {cluster.coordinates.ra} · Dec {cluster.coordinates.dec}
                            </div>
                        </div>
                    )}
                    {cluster.distance_ly && (
                        <div>
                            <div style={{ color: '#3a7a9a', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.15em', marginBottom: '4px' }}>
                                DISTÂNCIA
                            </div>
                            <div style={{ color: '#f5c542', fontFamily: 'monospace', fontSize: '12px' }}>
                                {cluster.distance_ly.toLocaleString()} ly · {cluster.distance_pc?.toLocaleString()} pc
                            </div>
                        </div>
                    )}
                    <div>
                        <div style={{ color: '#3a7a9a', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.15em', marginBottom: '4px' }}>
                            MEMBROS
                        </div>
                        <div style={{ color: '#4af5a0', fontFamily: 'monospace', fontSize: '12px' }}>
                            {data.total_members} encontrados
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de membros */}
            {members.length > 0 ? (
                <div>
                    <div style={{
                        color: '#3a7a9a', fontFamily: 'monospace', fontSize: '11px',
                        letterSpacing: '0.15em', marginBottom: '12px',
                    }}>
                        ★ MEMBROS CATALOGADOS — clique para ver detalhes
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {displayed.map((obj, i) => (
                            <MemberCard
                                key={i}
                                obj={obj}
                                selected={selectedMember?.name === obj.name}
                                onClick={() => setSelectedMember(
                                    selectedMember?.name === obj.name ? null : obj
                                )}
                            />
                        ))}
                    </div>

                    {members.length > 20 && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            style={{
                                marginTop: '14px', width: '100%',
                                background: 'transparent', border: '1px solid #0e2535',
                                color: '#2a5a7a', fontFamily: 'monospace', fontSize: '11px',
                                padding: '10px', borderRadius: '3px', cursor: 'pointer',
                                letterSpacing: '0.15em', transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.target.style.borderColor = '#1a4a6a'; e.target.style.color = '#4a9fd4'; }}
                            onMouseLeave={e => { e.target.style.borderColor = '#0e2535'; e.target.style.color = '#2a5a7a'; }}
                        >
                            {showAll ? '▲ MOSTRAR MENOS' : `▼ VER TODOS (${members.length})`}
                        </button>
                    )}
                </div>
            ) : (
                <div style={{ color: '#3a6a8a', fontFamily: 'monospace', fontSize: '12px', fontStyle: 'italic' }}>
                    Nenhum membro catalogado encontrado no SIMBAD.
                </div>
            )}

            {selectedMember && (
                <ListItemModal
                    obj={selectedMember}
                    onClose={() => setSelectedMember(null)}
                />
            )}
        </div>
    );
}