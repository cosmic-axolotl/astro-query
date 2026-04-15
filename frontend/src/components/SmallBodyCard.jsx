import React from 'react';

function DataRow({ label, value, accent }) {
    if (value == null || value === '' || value === 'nan') return null;
    return (
        <div style={{ display: 'flex', gap: '12px', padding: '7px 0', borderBottom: '1px solid #ffffff0a' }}>
            <span style={{ color: '#4a7a9a', fontFamily: 'monospace', fontSize: '12px', minWidth: '180px', flexShrink: 0 }}>
                {label}
            </span>
            <span style={{ color: accent || '#c8dff0', fontFamily: 'monospace', fontSize: '12px' }}>
                {value}
            </span>
        </div>
    );
}

export default function SmallBodyCard({ data }) {
    const obj = data.object;
    const isComet = obj.object_type === 'Comet';
    const color = isComet ? '#4af5c2' : '#f5a623';
    const icon = isComet ? '☄️' : '🪨';
    const typeLabel = isComet ? 'Cometa' : 'Asteroide';

    return (
        <div style={{
            background: '#050d18',
            border: '1px solid #1a3050',
            borderLeft: '3px solid ' + color,
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
                background: 'radial-gradient(circle at top right, ' + color + '15, transparent 70%)',
                pointerEvents: 'none',
            }} />

            {/* Header */}
            <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '36px' }}>{icon}</span>
                        <div>
                            <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '28px', color: '#e8f4ff' }}>
                                {obj.name}
                            </h2>
                            <div style={{ color: '#4a7a9a', fontFamily: 'monospace', fontSize: '11px', marginTop: '4px' }}>
                                {typeLabel} · JPL Small-Body Database
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        <span style={{
                            color: color, border: '1px solid ' + color + '44',
                            padding: '4px 14px', fontFamily: 'monospace',
                            fontSize: '12px', borderRadius: '3px',
                            background: color + '11',
                        }}>{typeLabel}</span>

                        {obj.neo && (
                            <span style={{
                                color: '#f5c542', border: '1px solid #f5c54244',
                                padding: '4px 14px', fontFamily: 'monospace',
                                fontSize: '12px', borderRadius: '3px',
                                background: '#f5c54211',
                            }}>NEO</span>
                        )}

                        {obj.pha && (
                            <span style={{
                                color: '#f54a4a', border: '1px solid #f54a4a44',
                                padding: '4px 14px', fontFamily: 'monospace',
                                fontSize: '12px', borderRadius: '3px',
                                background: '#f54a4a11',
                            }}>⚠ PHA</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Dados em grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                <div>
                    <div style={{ color: '#3a7a9a', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '10px' }}>
                        PROPRIEDADES FÍSICAS
                    </div>
                    <DataRow label="Diâmetro" value={obj.diameter_km ? obj.diameter_km.toFixed(2) + ' km' : null} accent="#4af5c2" />
                    <DataRow label="Albedo" value={obj.albedo ? obj.albedo.toFixed(3) : null} />
                    <DataRow label="Rotação" value={obj.rotation_h ? obj.rotation_h.toFixed(3) + ' h' : null} />
                    <DataRow label="Magnitude absoluta" value={obj.abs_magnitude ? obj.abs_magnitude.toFixed(2) : null} accent="#c8f542" />
                    <DataRow label="Taxonomia" value={obj.taxonomy || null} accent="#b06af5" />
                </div>
                <div>
                    <div style={{ color: '#3a7a9a', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '10px' }}>
                        ELEMENTOS ORBITAIS
                    </div>
                    <DataRow label="Semi-eixo maior" value={obj.semi_major_axis_au ? obj.semi_major_axis_au.toFixed(4) + ' AU' : null} accent="#7ad4f5" />
                    <DataRow label="Excentricidade" value={obj.eccentricity ? obj.eccentricity.toFixed(4) : null} />
                    <DataRow label="Inclinação" value={obj.inclination_deg ? obj.inclination_deg.toFixed(3) + '°' : null} />
                    <DataRow label="Periélio" value={obj.perihelion_au ? obj.perihelion_au.toFixed(4) + ' AU' : null} accent="#f5c542" />
                    <DataRow label="Período orbital" value={obj.orbital_period_yr ? obj.orbital_period_yr.toFixed(3) + ' anos' : null} />
                </div>
            </div>

            {/* NEO / PHA explicação */}
            {(obj.neo || obj.pha) && (
                <div style={{ marginTop: '16px', padding: '12px 16px', background: '#080c14', border: '1px solid #1a2a3a', borderRadius: '4px' }}>
                    {obj.pha && (
                        <div style={{ color: '#c04040', fontFamily: 'monospace', fontSize: '11px', marginBottom: obj.neo ? '6px' : 0 }}>
                            ⚠ PHA (Potentially Hazardous Asteroid) — objeto com órbita que se aproxima da Terra a menos de 0.05 AU e diâmetro maior que ~140m.
                        </div>
                    )}
                    {obj.neo && !obj.pha && (
                        <div style={{ color: '#8a8a40', fontFamily: 'monospace', fontSize: '11px' }}>
                            ★ NEO (Near-Earth Object) — objeto com periélio menor que 1.3 AU.
                        </div>
                    )}
                </div>
            )}

            {/* Sources */}
            <div style={{ marginTop: '18px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ color: '#2a5a7a', fontFamily: 'monospace', fontSize: '11px' }}>SOURCES:</span>
                {data.sources?.map(function (s) {
                    return (
                        <span key={s} style={{
                            color: '#4a7a9a', border: '1px solid #1a3a5a',
                            padding: '2px 10px', fontFamily: 'monospace',
                            fontSize: '11px', borderRadius: '2px',
                        }}>{s}</span>
                    );
                })}
                <a
                    href={'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=' + encodeURIComponent(obj.name || '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: 'auto' }}
                >
                    <span style={{ color: '#2a6a9a', fontFamily: 'monospace', fontSize: '10px' }}>
                        → JPL SBDB
                    </span>
                </a>
            </div>
        </div>
    );
}