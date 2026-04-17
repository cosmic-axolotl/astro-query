import { useState } from 'react';
import EnrichmentPanel from './EnrichmentPanel';
import { getObjectTypeInfo, CONFIDENCE_LABELS } from '../utils/objectTypes';

const TYPE_COLORS = {
    galaxy: '#b06af5',
    star: '#f5a623',
    nebula: '#4af5c2',
    cluster: '#f54a8a',
    pulsar: '#4a9fd4',
    'wolf-rayet': '#ff6a3d',
    'wolf rayet': '#ff6a3d',
    exoplanet: '#4af5c2',
    'white dwarf': '#c8dff0',
    supergiant: '#f5a030',
    variable: '#f5e642',
    default: '#4a9fd4',
};

function typeColor(t = '') {
    const tl = t.toLowerCase();
    const key = Object.keys(TYPE_COLORS).find(k => tl.includes(k));
    return key ? TYPE_COLORS[key] : TYPE_COLORS.default;
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
                    {/* Setinha alinhada à direita */}
                    <div style={{
                        position: 'absolute', bottom: '100%', right: '20px',
                        borderLeft: '7px solid transparent',
                        borderRight: '7px solid transparent',
                        borderBottom: '7px solid #2a5a7a',
                    }} />
                    <div style={{
                        color: '#4a9fd4', fontFamily: 'monospace', fontSize: '12px',
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

function DataRow({ label, value, accent }) {
    if (value == null) return null;
    return (
        <div style={{ display: 'flex', gap: '12px', padding: '7px 0', borderBottom: '1px solid #ffffff0a' }}>
            <span style={{ color: '#4a7a9a', fontFamily: 'monospace', fontSize: '12px', minWidth: '140px', flexShrink: 0 }}>
                {label}
            </span>
            <span style={{ color: accent || '#c8dff0', fontFamily: 'monospace', fontSize: '12px' }}>
                {value}
            </span>
        </div>
    );
}

export default function ObjectCard({ data }) {
    const obj = data.object;
    const color = typeColor(obj.object_type);
    const typeInfo = getObjectTypeInfo(obj.object_type);
    const confInfo = data.confidence
        ? (CONFIDENCE_LABELS[data.confidence] || { label: data.confidence, desc: '', color: '#4af5a0' })
        : null;

    return (
        <div style={{
            background: '#050d18',
            border: '1px solid #1a3050',
            borderLeft: `3px solid ${color}`,
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
                background: `radial-gradient(circle at top right, ${color}15, transparent 70%)`,
                pointerEvents: 'none',
            }} />

            {/* Header */}
            <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                        <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '30px', color: '#e8f4ff' }}>
                            {obj.name}
                        </h2>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                            {obj.aliases?.slice(0, 4).map((a, i) => (
                                <span key={i} style={{ color: '#3a6a8a', fontFamily: 'monospace', fontSize: '12px' }}>{a}</span>
                            ))}
                        </div>
                    </div>

                    {/* Tags com tooltip */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        <Tooltip text={typeInfo}>
                            <span style={{
                                color: color, border: `1px solid ${color}55`,
                                padding: '4px 14px', fontFamily: 'monospace',
                                fontSize: '12px', borderRadius: '3px', cursor: 'help',
                                background: `${color}11`,
                            }}>{obj.object_type}</span>
                        </Tooltip>

                        {confInfo && (
                            <Tooltip text={{ label: confInfo.label, desc: confInfo.desc }}>
                                <span style={{
                                    color: confInfo.color, border: `1px solid ${confInfo.color}55`,
                                    padding: '4px 14px', fontFamily: 'monospace',
                                    fontSize: '12px', borderRadius: '3px', cursor: 'help',
                                    background: `${confInfo.color}11`,
                                }}>{data.confidence}</span>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </div>

            {/* Data grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                <div>
                    <div style={{ color: '#3a7a9a', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '10px' }}>
                        ⊕ COORDENADAS
                    </div>
                    <DataRow label="RA" value={obj.coordinates?.ra} accent="#7ad4f5" />
                    <DataRow label="Dec" value={obj.coordinates?.dec} accent="#7ad4f5" />
                    <DataRow label="Distância" value={obj.distance_ly ? `${obj.distance_ly} ly` : null} accent="#f5c542" />
                    <DataRow label="Distância" value={obj.distance_pc ? `${obj.distance_pc} pc` : null} />
                </div>
                <div>
                    <div style={{ color: '#3a7a9a', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '10px' }}>
                        ◈ FÍSICO
                    </div>
                    <DataRow label="Tipo Espectral" value={obj.spectral_type} accent="#b06af5" />
                    <DataRow label="Temperatura" value={obj.temperature_k ? `${obj.temperature_k} K` : null} accent="#f57a4a" />
                    <DataRow label="Massa" value={obj.mass_solar ? `${obj.mass_solar} M☉` : null} />
                    <DataRow label="Luminosidade" value={obj.luminosity_solar ? `${obj.luminosity_solar} L☉` : null} />
                    <DataRow label="Magnitude ap." value={obj.magnitude?.apparent?.toFixed(3)} accent="#c8f542" />
                    <DataRow label="Vel. Radial" value={obj.radial_velocity_kms ? `${obj.radial_velocity_kms.toFixed(2)} km/s` : null} />
                    <DataRow label="Redshift" value={obj.redshift?.toFixed(6)} />
                </div>
            </div>

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

            {/* Enrichments */}
            <EnrichmentPanel enrichments={data.enrichments} />
        </div>
    );
}