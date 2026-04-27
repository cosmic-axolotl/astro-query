from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from services.crossmatch import enrich_object
from services.simbad import query_single_object, query_by_type, query_cluster_members, query_cluster_info
from services.gaia import query_gaia_by_coords
from services.exoplanets import query_exoplanet, query_exoplanets_by_host, query_habitable_zone
from services.solarsystem import query_solar_body
from services.smallbodies import query_small_body
from models.schemas import (
    SingleResponse, ListResponse,
    ObjectResult, ListItem, Coordinates, Magnitude,
    Enrichments, HipparcosData, TwoMassData, AdsArticle
)

router = APIRouter(
    prefix='/search',
    tags=['Search'],
)

OTYPE_MAP = {
    'wolf rayet':        'WR*',
    'wolf-rayet':        'WR*',
    'pulsar':            'Psr',
    'neutron star':      'NS',
    'cepheid':           'Ce*',
    'rr lyrae':          'RR*',
    'white dwarf':       'WD*',
    'galaxy':            'G',
    'quasar':            'QSO',
    'agn':               'AGN',
    'open cluster':      'OpC',
    'globular':          'GlC',
    'supergiant':        'sg*',
    'red giant':         'RG*',
    'brown dwarf':       'BD*',
    'planetary nebula':  'PN',
    'supernova remnant': 'SNR',
    'black hole':        'BH',
}


@router.get('/object', response_model=SingleResponse)
async def search_object(
    name:              str  = Query(..., description='Nome do objeto: * alf Ori, M31, NGC 224'),
    include_hipparcos: bool = Query(True,  description='Incluir dados do Hipparcos'),
    include_2mass:     bool = Query(True,  description='Incluir fotometria 2MASS'),
    include_gaia:      bool = Query(True,  description='Incluir dados do Gaia DR3'),
    include_ads:       bool = Query(False, description='Incluir artigos NASA/ADS'),
    ads_limit:         int  = Query(3, ge=1, le=10),
):
    '''Busca objeto com enriquecimento de múltiplos catálogos.'''
    try:
        raw = enrich_object(
            name,
            include_hipparcos=include_hipparcos,
            include_2mass=include_2mass,
            include_ads=include_ads,
            ads_limit=ads_limit,
        )
    except Exception:
        raise HTTPException(status_code=503, detail='Serviço indisponível.')

    if raw is None:
        raise HTTPException(
            status_code=404,
            detail=f'Objeto {name!r} não encontrado.',
        )

    # Gaia — enriquece se tiver coordenadas
    gaia_data = None
    if include_gaia and raw.get('ra') and raw.get('dec'):
        try:
            ra_deg  = float(raw['ra'])
            dec_deg = float(raw['dec'])
            gaia = query_gaia_by_coords(ra_deg, dec_deg)
            if gaia:
                raw.setdefault('enrichments', {})['gaia'] = gaia
                if 'sources' not in raw:
                    raw['sources'] = ['SIMBAD']
                if 'Gaia DR3' not in raw['sources']:
                    raw['sources'].append('Gaia DR3')
                # Gaia tem prioridade para distância
                if gaia.get('distance_ly'):
                    raw['distance_ly'] = gaia['distance_ly']
                    raw['distance_pc'] = gaia['distance_pc']
                gaia_data = gaia
        except Exception:
            pass

    coords = None
    if raw.get('ra') and raw.get('dec'):
        coords = Coordinates(ra=raw['ra'], dec=raw['dec'])

    mag = None
    if raw.get('magnitude_v') is not None:
        mag = Magnitude(apparent=raw['magnitude_v'])

    obj = ObjectResult(
        name=raw['name'],
        aliases=raw.get('aliases', []),
        object_type=raw['object_type'] or 'Unknown',
        coordinates=coords,
        spectral_type=raw.get('spectral_type'),
        distance_pc=raw.get('distance_pc'),
        distance_ly=raw.get('distance_ly'),
        magnitude=mag,
        radial_velocity_kms=raw.get('radial_velocity'),
        redshift=raw.get('redshift'),
        catalogs=raw.get('sources', ['SIMBAD']),
    )

    raw_enr = raw.get('enrichments', {})
    hip_data   = None
    tmass_data = None
    ads_data   = None

    if raw_enr.get('hipparcos'):
        h = raw_enr['hipparcos']
        hip_data = HipparcosData(
            hip_id=h.get('hip_id'),
            magnitude_v=h.get('magnitude_v'),
            color_bv=h.get('color_bv'),
            parallax_mas=h.get('parallax_mas'),
            parallax_err=h.get('parallax_err'),
            distance_ly=h.get('distance_ly'),
            pm_ra=h.get('pm_ra'),
            pm_dec=h.get('pm_dec'),
        )

    if raw_enr.get('2mass'):
        t = raw_enr['2mass']
        tmass_data = TwoMassData(
            two_mass_id=t.get('2mass_id'),
            j_mag=t.get('j_mag'),
            h_mag=t.get('h_mag'),
            k_mag=t.get('k_mag'),
            quality=t.get('quality'),
        )

    if raw_enr.get('ads_articles'):
        ads_data = [AdsArticle(**a) for a in raw_enr['ads_articles']]

    enrichments = Enrichments(
        hipparcos=hip_data,
        two_mass=tmass_data,
        ads_articles=ads_data,
    )

    return SingleResponse(
        object=obj,
        enrichments=enrichments,
        sources=raw.get('sources', ['SIMBAD']),
        confidence='high',
    )


@router.get('/type', response_model=ListResponse)
async def search_by_type(
    query:  str = Query(...),
    limit:  int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    ...
    raw_list = query_by_type(otype_code, limit=limit, offset=offset)

    '''Busca objetos por tipo ou classe.'''
    query_lower  = query.lower().strip()
    otype_code   = None
    matched_term = None

    for term, code in OTYPE_MAP.items():
        if term in query_lower:
            otype_code   = code
            matched_term = term
            break

    if otype_code is None:
        raise HTTPException(
            status_code=422,
            detail={
                'message':   f'Tipo {query!r} não reconhecido.',
                'available': list(OTYPE_MAP.keys()),
            },
        )

    raw_list = query_by_type(otype_code, limit=limit)
    items    = [ListItem(**r) for r in raw_list]

    return ListResponse(
        query_interpretation=f'{len(items)} objetos do tipo {matched_term}',
        results=items,
        sources=['SIMBAD'],
    )


@router.get('/cluster')
async def search_cluster(
    name:  str = Query(..., description='Nome do aglomerado: Pleiades, Hyades, NGC 2516...'),
    limit: int = Query(50, ge=1, le=200),
):
    '''Busca um aglomerado estelar e seus membros catalogados.'''
    try:
        raw = query_cluster_info(name)
    except Exception:
        raise HTTPException(status_code=503, detail='Serviço indisponível.')

    if raw is None:
        raise HTTPException(
            status_code=404,
            detail=f'Aglomerado {name!r} não encontrado.',
        )

    members = query_cluster_members(raw['name'], limit=limit)

    coords = None
    if raw.get('ra') and raw.get('dec'):
        coords = Coordinates(ra=raw['ra'], dec=raw['dec'])

    obj = ObjectResult(
        name=raw['name'],
        aliases=raw.get('aliases', []),
        object_type=raw['object_type'] or 'OpC',
        coordinates=coords,
        distance_pc=raw.get('distance_pc'),
        distance_ly=raw.get('distance_ly'),
        catalogs=raw.get('catalogs', ['SIMBAD']),
    )

    return {
        'mode':          'cluster',
        'cluster':       obj,
        'members':       members,
        'sources':       ['SIMBAD'],
        'total_members': len(members),
    }


@router.get('/exoplanet')
async def search_exoplanet(
    name:      Optional[str]  = Query(None, description='Nome: 55 Cnc e, TRAPPIST-1 b...'),
    host:      Optional[str]  = Query(None, description='Estrela hospedeira: TRAPPIST-1'),
    habitable: bool           = Query(False, description='Listar candidatos zona habitável'),
    limit:     int            = Query(20, ge=1, le=100),
):
    '''Busca exoplanetas no NASA Exoplanet Archive.'''
    if habitable:
        results = query_habitable_zone(limit=limit)
        return {
            'mode':    'exoplanet_list',
            'results': results,
            'sources': ['NASA Exoplanet Archive'],
            'total':   len(results),
        }

    if host:
        results = query_exoplanets_by_host(host)
        if not results:
            raise HTTPException(status_code=404, detail=f'Nenhum exoplaneta encontrado para {host!r}.')
        return {
            'mode':    'exoplanet_list',
            'results': results,
            'sources': ['NASA Exoplanet Archive'],
            'total':   len(results),
        }

    if name:
        result = query_exoplanet(name)
        if not result:
            raise HTTPException(status_code=404, detail=f'Exoplaneta {name!r} não encontrado.')
        return {
            'mode':    'exoplanet',
            'object':  result,
            'sources': ['NASA Exoplanet Archive'],
        }

    raise HTTPException(status_code=422, detail='Forneça name, host ou habitable=true.')


@router.get('/planet')
async def search_planet(
    name: str = Query(..., description='Nome: mars, jupiter, moon, voyager2, jwst...'),
):
    '''Busca posição atual de planetas e sondas via JPL Horizons.'''
    result = query_solar_body(name)
    if not result:
        raise HTTPException(status_code=404, detail=f'Corpo {name!r} não encontrado.')
    return {
        'mode':    'solar_body',
        'object':  result,
        'sources': ['JPL Horizons'],
    }


@router.get('/smallbody')
async def search_small_body(
    name: str = Query(..., description='Nome: Ceres, Apophis, Halley, 99942...'),
):
    '''Busca asteroides e cometas no JPL Small-Body Database.'''
    result = query_small_body(name)
    if not result:
        raise HTTPException(status_code=404, detail=f'Objeto {name!r} não encontrado.')
    return {
        'mode':    'small_body',
        'object':  result,
        'sources': ['JPL SBDB'],
    }