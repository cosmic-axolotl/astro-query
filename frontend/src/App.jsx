import { useState, useCallback } from 'react';
import StarField from './components/StarField';
import SearchBar from './components/SearchBar';
import ObjectCard from './components/ObjectCard';
import ResultTable from './components/ResultTable';
import ClusterCard from './components/ClusterCard';
import SolarBodyCard from './components/SolarBodyCard';
import ListItemModal from './components/ListItemModal';
import { searchObject, searchByType, searchCluster, searchPlanet, searchExoplanet, searchSmallBody } from './api';
import { resolveObjectName, getSuggestions, OBJECT_CATEGORIES } from './utils/dictionary';

const LANG = {
  pt: {
    subtitle: 'Base de dados de objetos astronômicos',
    sources: 'SIMBAD · VizieR · Hipparcos · 2MASS · NASA/ADS · Gaia DR3',
    querying: 'CONSULTANDO CATÁLOGOS…',
    notFound: (t) => `Objeto "${t}" não encontrado.`,
    notRecognized: (t) => `Tipo "${t}" não reconhecido.`,
    serverError: 'Erro ao conectar ao servidor.',
    suggestions: 'Você quis dizer:',
    queryLabel: 'RESULTADO:',
  },
  en: {
    subtitle: 'Astronomical object database',
    sources: 'SIMBAD · VizieR · Hipparcos · 2MASS · NASA/ADS · Gaia DR3',
    querying: 'QUERYING CATALOGS…',
    notFound: (t) => `Object "${t}" not found.`,
    notRecognized: (t) => `Type "${t}" not recognized.`,
    serverError: 'Error connecting to server.',
    suggestions: 'Did you mean:',
    queryLabel: 'RESULT:',
  },
};

const CLASS_KEYWORDS = [
  'wolf rayet', 'pulsar', 'cepheid', 'white dwarf', 'galaxy',
  'quasar', 'neutron star', 'supergiant', 'red giant', 'brown dwarf',
  'planetary nebula', 'supernova', 'black hole', 'agn', 'rr lyrae',
];

const CLUSTER_KEYWORDS = [
  'cluster', 'aglomerado', 'pleiades', 'hyades', 'praesepe',
  'omega centauri', 'globular', 'open cluster',
];

const SOLAR_KEYWORDS = [
  'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus',
  'neptune', 'pluto', 'moon', 'sun', 'sol', 'lua', 'marte', 'júpiter',
  'saturno', 'urano', 'netuno', 'voyager', 'jwst', 'cassini',
  'phobos', 'deimos', 'io', 'europa', 'ganymede', 'callisto',
  'titan', 'enceladus', 'triton', 'charon',
];

const EXOPLANET_KEYWORDS = [
  'exoplanet', 'exoplaneta', 'kepler', 'trappist', 'hot jupiter',
  'super earth', 'habitable', 'zona habitável', 'cnc e', 'tau boo',
];

const ASTEROID_KEYWORDS = [
  'asteroid', 'asteroide', 'apophis', 'ceres', 'bennu', 'vesta',
  'halley', 'hale-bopp', 'comet', 'cometa',
];

export default function App() {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState({ hipparcos: true, twoMass: true, ads: false });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('cards');
  const [selectedObj, setSelectedObj] = useState(null);
  const [limit, setLimit] = useState(20);
  const [lang, setLang] = useState('pt');
  const [suggestions, setSuggestions] = useState([]);

  const T = LANG[lang];

  const handleSearch = useCallback(async (q) => {
    const raw = String(q ?? query ?? '').trim();
    if (!raw) return;

    const term = resolveObjectName(raw);
    const termLow = term.toLowerCase();
    const rawLow = raw.toLowerCase();

    setLoading(true);
    setResult(null);
    setError(null);
    setSuggestions([]);

    try {
      const isCluster = CLUSTER_KEYWORDS.some(kw => termLow.includes(kw) || rawLow.includes(kw));
      const isClass = CLASS_KEYWORDS.some(kw => termLow.includes(kw)) && !isCluster;
      const isSolar = SOLAR_KEYWORDS.some(kw => termLow.includes(kw) || rawLow.includes(kw));
      const isExo = EXOPLANET_KEYWORDS.some(kw => termLow.includes(kw) || rawLow.includes(kw));
      const isAsteroid = ASTEROID_KEYWORDS.some(kw => termLow.includes(kw) || rawLow.includes(kw));

      if (isSolar && !isCluster && !isClass) {
        const data = await searchPlanet(raw);
        setResult({ mode: 'solar_body', ...data });
      } else if (isExo && !isCluster && !isClass) {
        const data = await searchExoplanet(raw);
        setResult({ mode: 'exoplanet', ...data });
      } else if (isAsteroid && !isCluster && !isClass) {
        const data = await searchSmallBody(raw);
        setResult({ mode: 'small_body', ...data });
      } else if (isCluster) {
        const data = await searchCluster(term, limit);
        setResult({ mode: 'cluster', ...data });
      } else if (isClass) {
        const data = await searchByType(term, limit);
        setResult({ mode: 'list', ...data });
      } else {
        const data = await searchObject(term, options);
        setResult({ mode: 'single', ...data });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError(T.notFound(raw));
        setSuggestions(getSuggestions(raw));
      } else if (err.response?.status === 422) {
        setError(T.notRecognized(raw));
      } else {
        setError(T.serverError);
      }
    } finally {
      setLoading(false);
    }
  }, [query, options, limit, lang]);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', fontFamily: "'Georgia', serif" }}>
      <StarField />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            {['pt', 'en'].map(l => (
              <button key={l} onClick={() => setLang(l)}
                style={{
                  background: lang === l ? '#0a2535' : 'transparent',
                  border: '1px solid',
                  borderColor: lang === l ? '#2a7ab0' : '#0e2a3a',
                  color: lang === l ? '#4a9fd4' : '#2a5a7a',
                  fontFamily: 'monospace', fontSize: '11px',
                  padding: '4px 12px', cursor: 'pointer',
                  borderRadius: l === 'pt' ? '3px 0 0 3px' : '0 3px 3px 0',
                  transition: 'all 0.15s',
                }}
              >{l.toUpperCase()}</button>
            ))}
          </div>

          <div style={{ color: '#0e2a4a', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.4em', marginBottom: '14px' }}>
            ◈ {T.subtitle.toUpperCase()} ◈
          </div>

          <h1 style={{
            margin: 0,
            fontSize: 'clamp(36px, 8vw, 72px)',
            fontFamily: "'Georgia', serif",
            background: 'linear-gradient(135deg, #a8d4f5 0%, #4a9fd4 40%, #9a6af5 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '0.04em', lineHeight: 1.1,
          }}>
            AstroQuery
          </h1>

          <p style={{ color: '#1a3a5a', fontFamily: 'monospace', fontSize: '12px', marginTop: '12px', letterSpacing: '0.12em' }}>
            {T.sources}
          </p>
        </div>

        {/* Categories */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '12px', marginBottom: '36px',
        }}>
          {OBJECT_CATEGORIES.map(cat => (
            <div key={cat.id}
              style={{
                background: '#040b14', border: `1px solid ${cat.color}33`,
                borderTop: `3px solid ${cat.color}`, borderRadius: '6px',
                padding: '16px 14px', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#071220'; e.currentTarget.style.boxShadow = `0 0 20px ${cat.color}22`; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#040b14'; e.currentTarget.style.boxShadow = 'none'; }}
              onClick={() => { const ex = cat.examples[0]; setQuery(ex.label); handleSearch(ex.q); }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{cat.icon}</div>
              <div style={{ color: cat.color, fontFamily: 'monospace', fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '6px' }}>
                {lang === 'pt' ? cat.labelPT : cat.labelEN}
              </div>
              <div style={{ color: '#6a9ab8', fontFamily: 'monospace', fontSize: '11px', lineHeight: '1.5', marginBottom: '10px' }}>
                {lang === 'pt' ? cat.descPT : cat.descEN}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {cat.examples.map(ex => (
                  <span key={ex.q}
                    onClick={e => { e.stopPropagation(); setQuery(ex.label); handleSearch(ex.q); }}
                    style={{ color: '#3a6a8a', fontFamily: 'monospace', fontSize: '11px', cursor: 'pointer', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.target.style.color = cat.color}
                    onMouseLeave={e => e.target.style.color = '#3a6a8a'}
                  >→ {ex.label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <SearchBar
          query={query} setQuery={setQuery}
          options={options} setOptions={setOptions}
          onSearch={handleSearch} loading={loading}
          limit={limit} setLimit={setLimit} lang={lang}
        />

        {/* Loading */}
        {loading && (
          <div style={{ marginTop: '32px', padding: '48px', border: '1px solid #0a1e30', borderRadius: '4px', background: '#020810', textAlign: 'center' }}>
            <div style={{ color: '#1a4a6a', fontFamily: 'monospace', fontSize: '13px', letterSpacing: '0.25em' }}>
              {T.querying}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
              {['SIMBAD', 'VizieR', 'Hipparcos', '2MASS'].map((s, i) => (
                <span key={s} style={{ color: '#1a4a6a', fontFamily: 'monospace', fontSize: '10px', animation: `pulse ${1 + i * 0.2}s infinite` }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Error + Suggestions */}
        {error && (
          <div style={{ marginTop: '24px', padding: '20px 24px', border: '1px solid #3a1010', borderRadius: '4px', background: '#080404' }}>
            <div style={{ color: '#b04040', fontFamily: 'monospace', fontSize: '13px', marginBottom: suggestions.length > 0 ? '14px' : 0 }}>
              ✗ {error}
            </div>
            {suggestions.length > 0 && (
              <div>
                <div style={{ color: '#3a2a2a', fontFamily: 'monospace', fontSize: '11px', marginBottom: '8px' }}>{T.suggestions}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {suggestions.map(s => (
                    <button key={s.canonical}
                      onClick={() => { setQuery(s.popular); handleSearch(s.canonical); }}
                      style={{ background: '#0a0505', border: '1px solid #2a1a10', color: '#8a5a4a', fontFamily: 'monospace', fontSize: '11px', cursor: 'pointer', padding: '4px 14px', borderRadius: '2px', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.target.style.color = '#f5a623'; e.target.style.borderColor = '#4a2a10'; }}
                      onMouseLeave={e => { e.target.style.color = '#8a5a4a'; e.target.style.borderColor = '#2a1a10'; }}
                    >{s.popular}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {result?.mode === 'single' && <ObjectCard data={result} />}
        {result?.mode === 'cluster' && <ClusterCard data={result} />}
        {result?.mode === 'solar_body' && <SolarBodyCard data={result} />}

        {/* List result */}
        {result?.mode === 'list' && (
          <>
            <div style={{ marginTop: '24px', padding: '10px 16px', background: '#030a14', border: '1px solid #0e2030', borderRadius: '3px' }}>
              <span style={{ color: '#2a5a7a', fontFamily: 'monospace', fontSize: '12px' }}>
                {T.queryLabel} <span style={{ color: '#4a8ab0' }}>{result.query_interpretation}</span>
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '14px' }}>
              {[['cards', '⊞ CARDS'], ['table', '≡ TABLE']].map(([v, l]) => (
                <button key={v} onClick={() => setView(v)}
                  style={{
                    padding: '5px 14px', fontFamily: 'monospace', fontSize: '11px',
                    border: '1px solid', borderRadius: '2px', cursor: 'pointer',
                    background: view === v ? '#0a2535' : 'transparent',
                    borderColor: view === v ? '#2a7ab0' : '#0e2a3a',
                    color: view === v ? '#4a9fd4' : '#2a5a7a', transition: 'all 0.15s',
                  }}
                >{l}</button>
              ))}
            </div>

            {view === 'cards' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                {result.results?.map((obj, i) => (
                  <div key={i}
                    onClick={() => setSelectedObj(selectedObj?.name === obj.name ? null : obj)}
                    style={{
                      background: selectedObj?.name === obj.name ? '#06101c' : '#040b14',
                      border: `1px solid ${selectedObj?.name === obj.name ? '#1e4a7a' : '#0e2540'}`,
                      borderLeft: '3px solid #4a9fd4', borderRadius: '4px',
                      padding: '16px 18px', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#05101a'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = selectedObj?.name === obj.name ? '#06101c' : '#040b14'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#d8eeff' }}>{obj.name}</span>
                        <div style={{ color: '#4a9fd4', fontFamily: 'monospace', fontSize: '11px', marginTop: '4px' }}>{obj.object_type}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', textAlign: 'right' }}>
                        {obj.apparent_magnitude != null && (
                          <div>
                            <div style={{ color: '#1a4a6a', fontFamily: 'monospace', fontSize: '9px' }}>MAG</div>
                            <div style={{ color: '#c8f542', fontFamily: 'monospace', fontSize: '14px' }}>{obj.apparent_magnitude}</div>
                          </div>
                        )}
                        {obj.spectral_type && (
                          <div>
                            <div style={{ color: '#1a4a6a', fontFamily: 'monospace', fontSize: '9px' }}>SPECTRAL</div>
                            <div style={{ color: '#b06af5', fontFamily: 'monospace', fontSize: '14px' }}>{obj.spectral_type}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ marginTop: '8px', color: '#1a4a6a', fontFamily: 'monospace', fontSize: '10px' }}>
                      {lang === 'pt' ? 'clique para detalhes →' : 'click for details →'}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedObj && <ListItemModal obj={selectedObj} onClose={() => setSelectedObj(null)} />}
            {view === 'table' && <ResultTable results={result.results} />}
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.2} 50%{opacity:1} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}