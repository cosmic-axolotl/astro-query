import { useState } from 'react';
import ListItemModal from './ListItemModal';

function DataRow({ label, value, accent }) {
    if (value == null || value === '' || value === 'nan') return null;
    return (
        <div style={{ display: 'flex', gap: '12px', padding: '7px 0', borderBottom: '1px solid #ffffff0a' }}>
            <span style={{ color: '#4a7a9a', fontFamily: 'monospace', fontSize: '12px', minWidth: '160px', flexShrink: 0 }}>
                {label}
            </span>
            <span style={{ color: accent || '#c8dff0', fontFamily: 'monospace', fontSize: '12px' }}>
                {value}
            </span>
        </div>
    );
}

const PLANET_ICONS = {
    mercury: '☿', venus: '♀', earth: '🌍', mars: '♂',
    jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆',
    pluto: '⊕', moon: '☽', sun: '☀', sol: '☀',
    marte: '♂', júpiter: '♃', saturno: '♄',
    lua: '☽', default: '🪐',
};

function getPlanetIcon(name = '') {
    return PLANET_ICONS[name.toLowerCase()] || PLANET_ICONS.default;
}

export default function SolarBodyCard({ data }) {
    const [selectedMoon, setSelectedMoon] = useState(null);
    const obj = data.object;
    const moons = obj.moons;

    return (
        <div style={{
            background: '#050d18',
            border: '1px solid #1a3050',
            borderLeft: '3px solid #f5c542',
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
                background: 'radial-gradient(circle at top right, #f5c54215, transparent 70%)',
                pointerEvents: 'none',
            }} />

            {/* Header */}
            <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '36px' }}>{getPlanetIcon(obj.name)}</span>
                        <div>
                            <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '30px', color: '#e8f4ff' }}>
                                {obj.name}
                            </h2>
                            <div style={{ color: '#4a7a9a', fontFamily: 'monospace', fontSize: '11px', marginTop: '4px' }}>
                                {obj.object_type} · JPL Horizons
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{
                            color: '#f5c542', border: '1px solid #f5c54244',
                            padding: '4px 14px', fontFamily: 'monospace',
                            fontSize: '12px', borderRadius: '3px',
                            background: '#f5c54211',
                        }}>Solar System</span>
                    </div>
                </div>

                {/* Epoch */}
                {obj.epoch && (
                    <div style={{ marginTop: '10px', color: '#2a5a7a', fontFamily: 'monospace', fontSize: '11px' }}>
                        ◉ Posição em: {obj.epoch} UTC
                    </div>
                )}
            </div>

            {/* Dados em grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                <div>
                    <div style={{ color: '#3a7a9a', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '10px' }}>
                        ⊕ POSIÇÃO ATUAL
                    </div>
                    <DataRow label="RA" value={obj.ra} accent="#7ad4f5" />
                    <DataRow label="Dec" value={obj.dec} accent="#7ad4f5" />
                    <DataRow label="Constelação" value={obj.constellation} />
                    <DataRow label="Dist. da Terra" value={obj.distance_au ? `${obj.distance_au.toFixed(4)} AU` : null} accent="#f5c542" />
                    <DataRow label="Dist. do Sol" value={obj.distance_sun_au ? `${obj.distance_sun_au.toFixed(4)} AU` : null} />
                </div>
                <div>
                    <div style={{ color: '#3a7a9a', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '10px' }}>
                        ◈ OBSERVAÇÃO
                    </div>
                    <DataRow label="Magnitude ap." value={obj.apparent_mag?.toFixed(2)} accent="#c8f542" />
                    <DataRow label="Ângulo de fase" value={obj.phase_angle_deg ? `${obj.phase_angle_deg.toFixed(2)}°` : null} />
                    <DataRow label="Elongação solar" value={obj.elongation_deg ? `${obj.elongation_deg.toFixed(2)}°` : null} />
                    <DataRow label="Velocidade" value={obj.velocity_kms ? `${obj.velocity_kms.toFixed(2)} km/s` : null} accent="#4af5c2" />
                </div>
            </div>

            {/* Luas */}
            {moons && (
                <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid #0e2035' }}>
                    <div style={{ color: '#3a7a9a', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '12px' }}>
                        ☽ LUAS — {moons.total_known} conhecidas
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                        {moons.listed.map((moon, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedMoon(selectedMoon?.name === moon.name ? null : { name: moon.name, object_type: 'Moon', catalogs: ['JPL Horizons'] })}
                                style={{
                                    padding: '5px 14px',
                                    background: selectedMoon?.name === moon.name ? '#0a2535' : 'transparent',
                                    border: '1px solid',
                                    borderColor: selectedMoon?.name === moon.name ? '#2a7ab0' : '#1a3a5a',
                                    color: selectedMoon?.name === moon.name ? '#4a9fd4' : '#6a9ab8',
                                    fontFamily: 'monospace', fontSize: '11px',
                                    borderRadius: '3px', cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => { e.target.style.borderColor = '#2a6a9a'; e.target.style.color = '#4a9fd4'; }}
                                onMouseLeave={e => {
                                    if (selectedMoon?.name !== moon.name) {
                                        e.target.style.borderColor = '#1a3a5a';
                                        e.target.style.color = '#6a9ab8';
                                    }
                                }}
                            >
                                {moon.name}
                            </button>
                        ))}
                    </div>
                    <div style={{ color: '#1a4a6a', fontFamily: 'monospace', fontSize: '10px' }}>
                        {moons.note}
                    </div>
                </div>
            )}

            {/* Sources */}
            <div style={{ marginTop: '18px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ color: '#2a5a7a', fontFamily: 'monospace', fontSize: '11px' }}>SOURCES:</span>
                {data.sources?.map(s => (
                    <span key={s} style={{
                        color: '#4a7a9a', border: '1px solid #1a3a5a',
                        padding: '2px 10px', fontFamily: 'monospace',
                        fontSize: '11px', borderRadius: '2px',
                    }}>{s}</span>
                ))}
            </div>

            {/* Modal da lua */}
            {selectedMoon && (
                <ListItemModal
                    obj={selectedMoon}
                    onClose={() => setSelectedMoon(null)}
                />
            )}
        </div>
    );
}