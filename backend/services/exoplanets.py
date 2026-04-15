from astroquery.ipac.nexsci.nasa_exoplanet_archive import NasaExoplanetArchive
import math
import logging

logger = logging.getLogger(__name__)


def _safe(value, cast=float, default=None):
    try:
        if value is None:
            return default
        result = cast(value)
        if cast == float and math.isnan(result):
            return default
        return result
    except (ValueError, TypeError):
        return default


def query_exoplanet(name: str) -> dict | None:
    '''
    Busca um exoplaneta pelo nome no NASA Exoplanet Archive.
    '''
    try:
        result = NasaExoplanetArchive.query_criteria(
            table='pscomppars',
            select='*',
            where=f"pl_name = '{name}'",
        )

        if result is None or len(result) == 0:
            return None

        return _exo_row_to_dict(result[0])

    except Exception as e:
        logger.error(f'Erro no Exoplanet Archive para {name!r}: {e}')
        return None


def query_exoplanets_by_host(hostname: str) -> list:
    '''
    Busca todos os exoplanetas de uma estrela hospedeira.
    '''
    try:
        result = NasaExoplanetArchive.query_criteria(
            table='pscomppars',
            select='*',
            where=f"hostname = '{hostname}'",
        )
        if result is None:
            return []
        return [_exo_row_to_dict(row) for row in result]
    except Exception as e:
        logger.error(f'Erro ao buscar sistema {hostname!r}: {e}')
        return []


def query_habitable_zone(limit: int = 20) -> list:
    '''
    Busca exoplanetas candidatos na zona habitável.
    Critérios: insolação entre 0.25 e 2.0 S⊕, raio menor que 2.0 R⊕.
    '''
    try:
        result = NasaExoplanetArchive.query_criteria(
            table='pscomppars',
            select='pl_name,hostname,pl_rade,pl_masse,pl_orbper,pl_insol,pl_eqt,sy_dist,discoverymethod,disc_year',
            where='pl_insol > 0.25 AND pl_insol < 2.0 AND pl_rade < 2.0',
            order='pl_rade',
        )
        if result is None:
            return []
        return [_exo_row_to_dict(row) for row in result[:limit]]
    except Exception as e:
        logger.error(f'Erro ao buscar zona habitável: {e}')
        return []


def _exo_row_to_dict(row) -> dict:
    return {
        'name':               str(row['pl_name']).strip(),
        'host_star':          str(row['hostname']).strip(),
        'object_type':        'Exoplanet',
        'orbital_period_d':   _safe(row.get('pl_orbper')),
        'radius_earth':       _safe(row.get('pl_rade')),
        'mass_earth':         _safe(row.get('pl_masse')),
        'equilibrium_temp_k': _safe(row.get('pl_eqt')),
        'insolation':         _safe(row.get('pl_insol')),
        'semi_major_axis_au': _safe(row.get('pl_orbsmax')),
        'discovery_method':   str(row.get('discoverymethod', '')).strip(),
        'discovery_year':     _safe(row.get('disc_year'), int),
        'distance_pc':        _safe(row.get('sy_dist')),
        'star_temp_k':        _safe(row.get('st_teff')),
        'star_radius_solar':  _safe(row.get('st_rad')),
        'catalogs':           ['NASA Exoplanet Archive'],
    }