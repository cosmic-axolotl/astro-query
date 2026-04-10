// Dicionário de nomes populares → nomes canônicos do SIMBAD
export const OBJECT_DICTIONARY = {
    // Estrelas famosas
    'betelgeuse': '* alf Ori',
    'rigel': '* bet Ori',
    'sirius': '* alf CMa',
    'vega': '* alf Lyr',
    'antares': '* alf Sco',
    'arcturus': '* alf Boo',
    'aldebaran': '* alf Tau',
    'spica': '* alf Vir',
    'pollux': '* bet Gem',
    'fomalhaut': '* alf PsA',
    'deneb': '* alf Cyg',
    'proxima centauri': 'V* V645 Cen',
    'alpha centauri': '* alf Cen',
    'barnard': "V* V2500 Oph",
    'polaris': '* alf UMi',

    // Galáxias
    'andromeda': 'M  31',
    'andromeda galaxy': 'M  31',
    'm31': 'M  31',
    'milky way': 'NAME Milky Way',
    'triangulum': 'M  33',
    'm33': 'M  33',
    'large magellanic': 'NAME LMC',
    'lmc': 'NAME LMC',
    'small magellanic': 'NAME SMC',
    'smc': 'NAME SMC',
    'whirlpool': 'M  51',
    'm51': 'M  51',
    'sombrero': 'M 104',
    'm104': 'M 104',
    'centaurus a': 'NAME Centaurus A',

    // Nebulosas
    'crab nebula': 'M   1',
    'm1': 'M   1',
    'orion nebula': 'M  42',
    'm42': 'M  42',
    'ring nebula': 'M  57',
    'm57': 'M  57',
    'eagle nebula': 'M  16',
    'm16': 'M  16',
    'pillars': 'M  16',

    // Aglomerados
    'pleiades': 'Cl Melotte  22',
    'seven sisters': 'Cl Melotte  22',
    'hyades': 'Cl Melotte  25',
    'omega centauri': 'NAME Omega Cen',
    'hercules cluster': 'M  13',
    'm13': 'M  13',
    'beehive': 'M  44',
    'praesepe': 'M  44',
    'm44': 'M  44',

    // Buracos negros / objetos especiais
    'sagittarius a': 'NAME Sgr A*',
    'sgr a': 'NAME Sgr A*',
    'sgr a*': 'NAME Sgr A*',
    'm87': 'M  87',
};

// Sugestões quando o objeto não é encontrado
export const SEARCH_SUGGESTIONS = {
    'betelgeuse': '* alf Ori',
    'andromeda': 'M  31',
    'orion': 'M  42',
    'pleiades': 'Cl Melotte  22',
    'sirius': '* alf CMa',
};

// Resolve nome popular para canônico
export function resolveObjectName(input) {
    const key = input.toLowerCase().trim();
    return OBJECT_DICTIONARY[key] || input;
}

// Gera sugestões baseadas no input
export function getSuggestions(input) {
    const key = input.toLowerCase().trim();
    const suggestions = [];

    // Busca correspondências parciais no dicionário
    Object.entries(OBJECT_DICTIONARY).forEach(([popular, canonical]) => {
        if (popular.includes(key) || key.includes(popular)) {
            suggestions.push({ popular, canonical });
        }
    });

    return suggestions.slice(0, 4);
}

// Categorias de objetos com exemplos
export const OBJECT_CATEGORIES = [
    {
        id: 'stars',
        icon: '⭐',
        labelPT: 'Estrelas',
        labelEN: 'Stars',
        descPT: 'Estrelas individuais, variáveis, gigantes',
        descEN: 'Individual stars, variables, giants',
        color: '#f5a623',
        examples: [
            { label: 'Betelgeuse', q: '* alf Ori' },
            { label: 'Sirius', q: '* alf CMa' },
            { label: 'Vega', q: '* alf Lyr' },
        ],
    },
    {
        id: 'galaxies',
        icon: '🌌',
        labelPT: 'Galáxias',
        labelEN: 'Galaxies',
        descPT: 'Galáxias, quasares, AGN',
        descEN: 'Galaxies, quasars, AGN',
        color: '#b06af5',
        examples: [
            { label: 'Andrômeda (M31)', q: 'M  31' },
            { label: 'Whirlpool (M51)', q: 'M  51' },
            { label: 'Sombrero (M104)', q: 'M 104' },
        ],
    },
    {
        id: 'clusters',
        icon: '✨',
        labelPT: 'Aglomerados',
        labelEN: 'Clusters',
        descPT: 'Aglomerados abertos e globulares',
        descEN: 'Open and globular clusters',
        color: '#4af5c2',
        examples: [
            { label: 'Pleiades', q: 'Pleiades' },
            { label: 'Omega Centauri', q: 'Omega Centauri' },
            { label: 'M13 Hercules', q: 'M  13' },
        ],
    },
    {
        id: 'exoplanets',
        icon: '🪐',
        labelPT: 'Exoplanetas',
        labelEN: 'Exoplanets',
        descPT: 'Planetas fora do Sistema Solar',
        descEN: 'Planets outside the Solar System',
        color: '#4a9fd4',
        examples: [
            { label: '55 Cnc e', q: '55 Cnc e' },
            { label: 'TRAPPIST-1 b', q: 'TRAPPIST-1 b' },
            { label: 'HD 209458 b', q: 'HD 209458 b' },
        ],
    },
    {
        id: 'solarsystem',
        icon: '☀️',
        labelPT: 'Sistema Solar',
        labelEN: 'Solar System',
        descPT: 'Planetas, luas, sondas espaciais',
        descEN: 'Planets, moons, space probes',
        color: '#f5c542',
        examples: [
            { label: 'Marte', q: 'mars' },
            { label: 'Júpiter', q: 'jupiter' },
            { label: 'JWST', q: 'jwst' },
        ],
    },
    {
        id: 'smallbodies',
        icon: '☄️',
        labelPT: 'Asteroides & Cometas',
        labelEN: 'Asteroids & Comets',
        descPT: 'Corpos menores do Sistema Solar',
        descEN: 'Small Solar System bodies',
        color: '#ff6a3d',
        examples: [
            { label: 'Apophis', q: 'apophis' },
            { label: 'Ceres', q: 'ceres' },
            { label: 'Halley', q: 'halley' },
        ],
    },
];