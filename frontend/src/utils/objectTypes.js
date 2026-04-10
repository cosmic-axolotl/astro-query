// Mapeamento de códigos SIMBAD para descrições legíveis
export const OBJECT_TYPES = {
    // Estrelas
    '*': { label: 'Estrela / Star', desc: 'Objeto estelar genérico' },
    '**': { label: 'Estrela Dupla / Double Star', desc: 'Sistema de duas estrelas gravitacionalmente ligadas' },
    's*r': { label: 'Supergigante Vermelha / Red Supergiant', desc: 'Estrela massiva na fase final de vida, temperatura ~3000-4500K' },
    'sg*': { label: 'Supergigante / Supergiant', desc: 'Estrela de luminosidade extremamente alta, massa > 8 M☉' },
    'RG*': { label: 'Gigante Vermelha / Red Giant', desc: 'Estrela em fase evoluída, expandida e fria' },
    'WD*': { label: 'Anã Branca / White Dwarf', desc: 'Remanescente estelar denso após o fim da sequência principal' },
    'NS': { label: 'Estrela de Nêutrons / Neutron Star', desc: 'Remanescente ultra-denso de supernova' },
    'BH': { label: 'Buraco Negro / Black Hole', desc: 'Objeto com gravidade que impede a fuga de luz' },
    'Psr': { label: 'Pulsar', desc: 'Estrela de nêutrons em rotação rápida emitindo pulsos de rádio' },
    'WR*': { label: 'Wolf-Rayet', desc: 'Estrela massiva e quente com ventos estelares intensos' },
    'Ce*': { label: 'Cefeida / Cepheid', desc: 'Estrela variável pulsante usada como vela padrão de distância' },
    'RR*': { label: 'RR Lyrae', desc: 'Variável pulsante de período curto, traçadora de populações antigas' },
    'BY*': { label: 'Variável BY Dra', desc: 'Estrela variável por manchas na superfície' },
    'SB*': { label: 'Binária Espectroscópica', desc: 'Par de estrelas detectado por variações no espectro' },
    'PM*': { label: 'Estrela com Mov. Próprio', desc: 'Estrela com deslocamento angular mensurável no céu' },
    'Y*O': { label: 'Objeto Estelar Jovem', desc: 'Estrela em formação, ainda envolta em gás e poeira' },
    'Em*': { label: 'Estrela de Emissão', desc: 'Estrela com linhas de emissão no espectro' },

    // Galáxias
    'G': { label: 'Galáxia / Galaxy', desc: 'Sistema de bilhões de estrelas, gás e matéria escura' },
    'GinPair': { label: 'Galáxia em Par', desc: 'Galáxia em interação gravitacional com outra' },
    'AGN': { label: 'Núcleo Ativo / AGN', desc: 'Galáxia com buraco negro supermassivo ativo no centro' },
    'QSO': { label: 'Quasar', desc: 'AGN extremamente luminoso em galáxia distante' },
    'EG*': { label: 'Galáxia Elíptica', desc: 'Galáxia com forma elipsoidal e pouca formação estelar' },

    // Nebulosas
    'PN': { label: 'Nebulosa Planetária', desc: 'Envelope de gás ejetado por estrela em fim de vida' },
    'SNR': { label: 'Remanescente de Supernova', desc: 'Gás e poeira expandidos após explosão de supernova' },
    'HII': { label: 'Região HII', desc: 'Nuvem de gás ionizado por estrelas jovens e quentes' },

    // Aglomerados
    'OpC': { label: 'Aglomerado Aberto', desc: 'Grupo de estrelas jovens formadas da mesma nuvem molecular' },
    'GlC': { label: 'Aglomerado Globular', desc: 'Esfera densa de centenas de milhares de estrelas antigas' },
    'Cl*': { label: 'Aglomerado Estelar', desc: 'Grupo de estrelas gravitacionalmente ligadas' },
    'As*': { label: 'Associação Estelar', desc: 'Grupo frouxo de estrelas jovens da mesma região de formação' },

    // Sistema Solar
    'BD*': { label: 'Anã Marrom / Brown Dwarf', desc: 'Objeto com massa entre planeta e estrela, sem fusão nuclear estável' },
};

export const CONFIDENCE_LABELS = {
    high: { label: 'Alta confiança', desc: 'Dados bem estabelecidos em múltiplos catálogos', color: '#4af5a0' },
    medium: { label: 'Média confiança', desc: 'Alguns dados podem ser preliminares ou de um único catálogo', color: '#f5c542' },
    low: { label: 'Baixa confiança', desc: 'Dados incertos ou conflitantes entre catálogos', color: '#f57a4a' },
};

export function getObjectTypeInfo(code) {
    return OBJECT_TYPES[code] || {
        label: code,
        desc: `Tipo de objeto SIMBAD: ${code}. Consulte simbad.u-strasbg.fr para detalhes.`,
    };
}