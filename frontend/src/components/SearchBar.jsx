import { useState } from 'react';

const CATALOGS = [
    { id: 'hipparcos', label: 'Hipparcos', color: '#f5a623' },
    { id: 'twoMass', label: '2MASS', color: '#4af5c2' },
    { id: 'ads', label: 'NASA/ADS', color: '#b06af5' },
];

const HELP_CONTENT = {
    pt: {
        title: 'Como pesquisar',
        sections: [
            {
                title: '⭐ Estrelas',
                content: 'Use o nome canônico do SIMBAD ou nomes populares como "Betelgeuse", "Sirius". O sistema converte automaticamente.',
            },
            {
                title: '🔍 Busca por Classe de Objeto',
                content: 'Digite o tipo de objeto para ver uma lista de exemplos catalogados. Tipos disponíveis:',
                types: [
                    ['wolf rayet', 'Estrelas Wolf-Rayet — massivas e quentes com ventos intensos'],
                    ['pulsar', 'Pulsares — estrelas de nêutrons em rotação rápida'],
                    ['cepheid', 'Cefeidas — variáveis pulsantes usadas para medir distâncias'],
                    ['white dwarf', 'Anãs Brancas — remanescentes estelares densos'],
                    ['neutron star', 'Estrelas de Nêutrons'],
                    ['red giant', 'Gigantes Vermelhas'],
                    ['supergiant', 'Supergigantes'],
                    ['brown dwarf', 'Anãs Marrons'],
                    ['planetary nebula', 'Nebulosas Planetárias'],
                    ['supernova remnant', 'Remanescentes de Supernova'],
                    ['galaxy', 'Galáxias'],
                    ['quasar', 'Quasares'],
                    ['agn', 'Núcleos Ativos de Galáxias'],
                    ['globular', 'Aglomerados Globulares'],
                    ['open cluster', 'Aglomerados Abertos'],
                    ['black hole', 'Buracos Negros'],
                ],
            },
            {
                title: '🌌 Galáxias e Nebulosas',
                content: 'Use designação Messier (M31, M42) ou NGC (NGC 224). Nomes populares como "Andromeda" são reconhecidos automaticamente.',
            },
            {
                title: '✨ Aglomerados',
                content: 'Digite o nome popular (Pleiades, Hyades, Omega Centauri) ou designação (M13, NGC 2516).',
            },
            {
                title: '🪐 Exoplanetas',
                content: 'Use o nome oficial: "55 Cnc e", "TRAPPIST-1 b", "HD 209458 b".',
            },
            {
                title: '☀️ Sistema Solar',
                content: 'Digite o nome: mars, jupiter, saturn, moon, voyager1, jwst. Retorna posição atual via JPL Horizons.',
            },
            {
                title: '☄️ Asteroides e Cometas',
                content: 'Digite o nome: "apophis", "ceres", "halley", "1P". Busca no JPL Small-Body Database.',
            },
        ],
        fields: {
            title: 'Campos do resultado',
            items: [
                ['RA / Dec', 'Ascensão reta e declinação — coordenadas celestes do objeto'],
                ['Distância', 'Distância em anos-luz (ly) ou parsecs (pc), calculada da paralaxe'],
                ['Magnitude ap.', 'Brilho aparente visto da Terra (menor = mais brilhante)'],
                ['Tipo Espectral', 'Classificação da estrela: O, B, A, F, G, K, M (quente → frio)'],
                ['Paralaxe', 'Deslocamento angular em miliarcsegundos — base para calcular distância'],
                ['Vel. Radial', 'Velocidade de afastamento/aproximação em km/s'],
                ['B-V', 'Índice de cor: negativo = azul (quente), positivo = vermelho (frio)'],
                ['Redshift (z)', 'Para galáxias distantes: expansão do universo. z=0.1 ≈ 1.3 bilhões ly'],
            ],
        },
    },
    en: {
        title: 'How to search',
        sections: [
            {
                title: '⭐ Stars',
                content: 'Use SIMBAD canonical name or popular names like "Betelgeuse", "Sirius". The system converts automatically.',
            },
            {
                title: '🔍 Object Class Search',
                content: 'Type the object class to see a list of catalogued examples. Available types:',
                types: [
                    ['wolf rayet', 'Wolf-Rayet Stars — massive, hot stars with intense winds'],
                    ['pulsar', 'Pulsars — rapidly rotating neutron stars'],
                    ['cepheid', 'Cepheids — pulsating variables used as distance indicators'],
                    ['white dwarf', 'White Dwarfs — dense stellar remnants'],
                    ['neutron star', 'Neutron Stars'],
                    ['red giant', 'Red Giants'],
                    ['supergiant', 'Supergiants'],
                    ['brown dwarf', 'Brown Dwarfs'],
                    ['planetary nebula', 'Planetary Nebulae'],
                    ['supernova remnant', 'Supernova Remnants'],
                    ['galaxy', 'Galaxies'],
                    ['quasar', 'Quasars'],
                    ['agn', 'Active Galactic Nuclei'],
                    ['globular', 'Globular Clusters'],
                    ['open cluster', 'Open Clusters'],
                    ['black hole', 'Black Holes'],
                ],
            },
            {
                title: '🌌 Galaxies & Nebulae',
                content: 'Use Messier (M31, M42) or NGC (NGC 224) designations. Popular names like "Andromeda" are recognized automatically.',
            },
            {
                title: '✨ Clusters',
                content: 'Type the popular name (Pleiades, Hyades, Omega Centauri) or designation (M13, NGC 2516).',
            },
            {
                title: '🪐 Exoplanets',
                content: 'Use the official name: "55 Cnc e", "TRAPPIST-1 b", "HD 209458 b".',
            },
            {
                title: '☀️ Solar System',
                content: 'Type the name: mars, jupiter, saturn, moon, voyager1, jwst. Returns current position via JPL Horizons.',
            },
            {
                title: '☄️ Asteroids & Comets',
                content: 'Type the name: "apophis", "ceres", "halley", "1P". Searches JPL Small-Body Database.',
            },
        ],
        fields: {
            title: 'Result fields explained',
            items: [
                ['RA / Dec', 'Right ascension and declination — celestial coordinates'],
                ['Distance', 'Distance in light-years (ly) or parsecs (pc), from parallax'],
                ['App. Magnitude', 'Apparent brightness as seen from Earth (lower = brighter)'],
                ['Spectral Type', 'Star classification: O, B, A, F, G, K, M (hot → cool)'],
                ['Parallax', 'Angular displacement in milliarcseconds — basis for distance'],
                ['Radial Vel.', 'Recession/approach speed in km/s'],
                ['B-V', 'Color index: negative = blue (hot), positive = red (cool)'],
                ['Redshift (z)', 'For distant galaxies: universe expansion. z=0.1 ≈ 1.3 billion ly'],
            ],
        },
    },
};

function HelpModal({ lang, onClose }) {
    const H = HELP_CONTENT[lang];
    const [tab, setTab] = useState('search');

    return (
        <>
            <div onClick={onClose} style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.75)',
                zIndex: 100, backdropFilter: 'blur(3px)',
            }} />
            <div style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'min(92vw, 680px)', maxHeight: '82vh',
                overflowY: 'auto', background: '#050d18',
                border: '1px solid #1a3050', borderTop: '3px solid #4a9fd4',
                borderRadius: '6px', padding: '28px', zIndex: 101,
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '20px', color: '#e8f4ff' }}>
                        {H.title}
                    </h2>
                    <button onClick={onClose} style={{
                        background: 'transparent', border: '1px solid #1a3a5a',
                        color: '#2a5a7a', fontFamily: 'monospace', fontSize: '11px',
                        padding: '3px 10px', borderRadius: '2px', cursor: 'pointer',
                    }}>✕</button>
                </div>

                <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
                    {[
                        ['search', lang === 'pt' ? 'Como Pesquisar' : 'How to Search'],
                        ['fields', lang === 'pt' ? 'Campos do Resultado' : 'Result Fields'],
                    ].map(([t, l]) => (
                        <button key={t} onClick={() => setTab(t)} style={{
                            padding: '5px 14px', fontFamily: 'monospace', fontSize: '10px',
                            border: '1px solid', borderRadius: '2px', cursor: 'pointer',
                            background: tab === t ? '#0a2535' : 'transparent',
                            borderColor: tab === t ? '#2a7ab0' : '#0e2a3a',
                            color: tab === t ? '#4a9fd4' : '#2a5a7a', transition: 'all 0.15s',
                        }}>{l}</button>
                    ))}
                </div>

                {tab === 'search' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {H.sections.map((s, i) => (
                            <div key={i} style={{ padding: '14px', background: '#040b14', border: '1px solid #0e2035', borderRadius: '4px' }}>
                                <div style={{ color: '#4a9fd4', fontFamily: 'monospace', fontSize: '12px', marginBottom: '6px', fontWeight: 'bold' }}>
                                    {s.title}
                                </div>
                                <div style={{ color: '#8ab8d8', fontFamily: 'Georgia, serif', fontSize: '13px', lineHeight: '1.6', marginBottom: s.types ? '10px' : 0 }}>
                                    {s.content}
                                </div>
                                {s.types && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '8px' }}>
                                        {s.types.map(([type, desc]) => (
                                            <div key={type} style={{ display: 'flex', gap: '10px', padding: '5px 0', borderBottom: '1px solid #0a1e30' }}>
                                                <span style={{ color: '#4af5c2', fontFamily: 'monospace', fontSize: '11px', minWidth: '170px', flexShrink: 0 }}>
                                                    "{type}"
                                                </span>
                                                <span style={{ color: '#5a8ab0', fontFamily: 'Georgia, serif', fontSize: '11px', lineHeight: '1.4' }}>
                                                    {desc}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'fields' && (
                    <div>
                        <div style={{ color: '#2a5a7a', fontFamily: 'monospace', fontSize: '11px', marginBottom: '12px' }}>
                            {H.fields.title}
                        </div>
                        {H.fields.items.map(([field, desc], i) => (
                            <div key={i} style={{ display: 'flex', gap: '14px', padding: '8px 0', borderBottom: '1px solid #0e2035' }}>
                                <span style={{ color: '#f5a623', fontFamily: 'monospace', fontSize: '11px', minWidth: '120px', flexShrink: 0 }}>
                                    {field}
                                </span>
                                <span style={{ color: '#7ab8d8', fontFamily: 'Georgia, serif', fontSize: '12px', lineHeight: '1.5' }}>
                                    {desc}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default function SearchBar({ query, setQuery, options, setOptions, onSearch, loading, limit, setLimit, lang }) {
    const [showHelp, setShowHelp] = useState(false);

    const toggleOption = (id) => {
        setOptions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const placeholder = lang === 'pt'
        ? 'Nome ou classe: "Betelgeuse", "M31", "wolf rayet", "Pleiades"...'
        : 'Name or class: "Betelgeuse", "M31", "wolf rayet", "Pleiades"...';

    return (
        <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Input principal */}
            <div style={{
                background: '#030810', border: '1px solid #1a3050',
                borderRadius: '6px', padding: '6px',
                display: 'flex', gap: '6px',
                boxShadow: '0 0 60px #04101e',
            }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px' }}>
                    <span style={{ color: '#1a4a6a', fontSize: '18px', flexShrink: 0 }}>⊕</span>
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && onSearch()}
                        placeholder={placeholder}
                        style={{
                            flex: 1, background: 'transparent', border: 'none',
                            outline: 'none', color: '#c8dff0',
                            fontFamily: 'Georgia, serif', fontSize: '16px',
                        }}
                    />
                </div>

                <button
                    onClick={() => setShowHelp(true)}
                    title={lang === 'pt' ? 'Como pesquisar' : 'How to search'}
                    style={{
                        padding: '10px 14px', background: 'transparent',
                        border: '1px solid #0e2535', borderRadius: '4px',
                        color: '#2a5a7a', fontFamily: 'monospace', fontSize: '13px',
                        cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
                    }}
                    onMouseEnter={e => { e.target.style.color = '#4a9fd4'; e.target.style.borderColor = '#1a4a6a'; }}
                    onMouseLeave={e => { e.target.style.color = '#2a5a7a'; e.target.style.borderColor = '#0e2535'; }}
                >?</button>

                <button
                    onClick={() => onSearch()}
                    disabled={loading}
                    style={{
                        padding: '12px 28px',
                        background: loading ? '#040c18' : 'linear-gradient(135deg, #0a3a6a, #0a2a50)',
                        border: '1px solid #1a4a7a', borderRadius: '4px',
                        color: loading ? '#1a3a5a' : '#4a9fd4',
                        fontFamily: 'monospace', fontSize: '12px',
                        letterSpacing: '0.2em', cursor: loading ? 'not-allowed' : 'pointer',
                        textTransform: 'uppercase', transition: 'all 0.2s', flexShrink: 0,
                    }}
                >{loading ? (lang === 'pt' ? 'BUSCANDO…' : 'QUERYING…') : 'QUERY'}</button>
            </div>

            {/* Controles */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px', alignItems: 'center' }}>
                <span style={{ color: '#2a5a7a', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.15em' }}>BASE:</span>
                {['SIMBAD', 'VizieR'].map(src => (
                    <span key={src} style={{ padding: '3px 12px', borderRadius: '2px', fontFamily: 'monospace', fontSize: '10px', border: '1px solid #2a7ab044', color: '#4a9fd4' }}>{src}</span>
                ))}

                <span style={{ color: '#0e2535', fontFamily: 'monospace', fontSize: '12px', margin: '0 2px' }}>|</span>

                <span style={{ color: '#2a5a7a', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.15em' }}>ENRICH:</span>
                {CATALOGS.map(cat => (
                    <button key={cat.id} onClick={() => toggleOption(cat.id)} style={{
                        padding: '3px 12px', borderRadius: '2px', fontFamily: 'monospace', fontSize: '10px',
                        letterSpacing: '0.08em', cursor: 'pointer', border: '1px solid',
                        background: options[cat.id] ? cat.color + '18' : 'transparent',
                        borderColor: options[cat.id] ? cat.color : '#1a3a5a',
                        color: options[cat.id] ? cat.color : '#2a5a7a',
                        transition: 'all 0.15s',
                    }}>{cat.label}</button>
                ))}

                <span style={{ color: '#0e2535', fontFamily: 'monospace', fontSize: '12px', margin: '0 2px' }}>|</span>

                <span style={{ color: '#2a5a7a', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.15em' }}>
                    {lang === 'pt' ? 'LIMITE:' : 'LIMIT:'}
                </span>
                {[20, 50, 100].map(n => (
                    <button key={n} onClick={() => setLimit(n)} style={{
                        padding: '3px 12px', borderRadius: '2px', fontFamily: 'monospace', fontSize: '10px',
                        letterSpacing: '0.08em', cursor: 'pointer', border: '1px solid',
                        background: limit === n ? '#0a2535' : 'transparent',
                        borderColor: limit === n ? '#2a7ab0' : '#1a3a5a',
                        color: limit === n ? '#4a9fd4' : '#2a5a7a',
                        transition: 'all 0.15s',
                    }}>{n}</button>
                ))}
            </div>

            {showHelp && <HelpModal lang={lang} onClose={() => setShowHelp(false)} />}
        </div>
    );
}