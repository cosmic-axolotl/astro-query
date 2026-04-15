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

const METHOD_COLORS = {
    'Transit': '#4a9fd4',
    'Radial Velocity': '#f5a623',
    'Imaging': '#4af5c2',
    'Microlensing': '#b06af5',
    'Astrometry': '#f5c542',
    'Timing Variations': '#ff6a3d',
};

function methodColor(m = '') {
    return METHOD_COLORS[m] || '#4a9fd4';
}

export default function ExoplanetCard({ data }) {
    const obj = data.object;
    const color = methodColor(obj.discovery_method);

    // Classifica o planeta por tamanho
    function planetClass(r) {
        if (!r) return null;
        if (r < 0.5) return { label: 'Sub-Terra', color: '#8a8a8a' };
        if (r < 1.5) return { label: 'Terrestre', color: '#4af5a0' };
        if (r < 2.5) return { label: 'Super-Terra', color: '#f5c542' };
        if (r < 4.0) return { label: 'Mini-Netuno', color: '#4a9fd4' };
        if (r < 10.0) return { label: 'Netuno', color: '#4a6af5' };
        return { label: 'Júpiter', color: '#f5a623' };
    }

    const pClass = planetClass(obj.radius_earth);

    // Zona habitável aproximada
    const inHZ = obj.insolation && obj.insolation > 0.25 && obj.insolation < 2.0;

    return (
        <div style={{
            background: '#050d18',
            border: '1px solid #1a3050',
            borderLeft: '3px solid #4a9fd4',
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
                background: 'radial-gradient(circle at top right, #4a9fd415, transparent 70%)',
                pointerEvents: 'none',
            }} />

            {/* Header */}
            <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '36px' }}>🪐</span>
                        <div>
                            <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '28px', color: '#e8f4ff' }}>
                                {obj.name}
                            </h2>
                            <div style={{ color: '#4a7a9a', fontFamily: 'monospace', fontSize: '11px', marginTop: '4px' }}>
                                Estrela hospedeira: <span style={{ color: '#7ab8d8' }}>{obj.host_star}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        {pClass && (
                            <span style={{
                                color: pClass.color, border: `1px solid ${pClass.color}44`,
                                padding: '4px 14px', fontFamily: 'monospace',
                                fontSize: '12px', borderRadius: '3px',
                                background: `${pClass.color}11`,
                            }}>{pClass.label}</span>
                        )}
                        {inHZ && (
                            <span style={{
                                color: '#4af5a0', border: '1px solid #4af5a044',
                                padding: '4px 14px', fontFamily: 'monospace',
                                fontSize: '12px', borderRadius: '3px',
                                background: '#4af5a011',
                            }}>🌱 Zona Habitável</span>
                        )}
                        <span style={{
                            color: color, border: `1px solid ${color}44`,
                            padding: '4px 14px', fontFamily: 'monospace',
                            fontSize: '12px', borderRadius: '3px',
                            background: `${color}11`,
                        }}>{obj.discovery_method || 'Exoplanet'}</span>
                    </div>
                </div>
            </div>

            {/* Dados em grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                <div>
                    <div style={{ color: '#3a7a9a', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '10px' }}>
                        🪐 PROPRIEDADES FÍSICAS
                    </div>
                    <DataRow label="Raio" value={obj.radius_earth ? `${obj.radius_earth.toFixed(2)} R⊕` : null} accent="#4af5c2" />
                    <DataRow label="Massa" value={obj.mass_earth ? `${obj.mass_earth.toFixed(2)} M⊕` : null} accent="#f5a623" />
                    <DataRow label="Temp. equilíbrio" value={obj.equilibrium_temp_k ? `${Math.round(obj.equilibrium_temp_k)} K` : null} accent="#f57a4a" />
                    <DataRow label="Insolação" value={obj.insolation ? `${obj.insolation.toFixed(2)} S⊕` : null} />
                </div>
                <div>
                    <div style={{ color: '#3a7a9a', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '10px' }}>
                        ⊕ ÓRBITA E DESCOBERTA
                    </div>
                    <DataRow label="Período orbital" value={obj.orbital_period_d ? `${obj.orbital_period_d.toFixed(3)} dias` : null} accent="#7ad4f5" />
                    <DataRow label="Semi-eixo maior" value={obj.semi_major_axis_au ? `${obj.semi_major_axis_au.toFixed(4)} AU` : null} />
                    <DataRow label="Dist. do sistema" value={obj.distance_pc ? `${obj.distance_pc.toFixed(1)} pc` : null} accent="#f5c542" />
                    <DataRow label="Ano de descoberta" value={obj.discovery_year} />
                    <DataRow label="Temp. da estrela" value={obj.star_temp_k ? `${Math.round(obj.star_temp_k)} K` : null} />
                    <DataRow label="Raio da estrela" value={obj.star_radius_solar ? `${obj.star_radius_solar.toFixed(2)} R☉` : null} />
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


                <a href={`https://exoplanetarchive.ipac.caltech.edu/overview/${encodeURIComponent(obj.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#2a6a9a', fontFamily: 'monospace', fontSize: '10px', textDecoration: 'none', marginLeft: 'auto' }}
                >
                    → NASA Exoplanet Archive
                </a>
            </div>
        </div >
    );
}