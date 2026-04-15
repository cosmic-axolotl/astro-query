from astroquery.gaia import Gaia
from astropy.coordinates import SkyCoord
import astropy.units as u
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


def query_gaia_by_coords(ra: float, dec: float, radius_arcsec: float = 5) -> dict | None:
    '''
    Busca dados Gaia DR3 por coordenadas decimais.
    Útil quando já temos RA/Dec do SIMBAD.
    '''
    try:
        coords = SkyCoord(ra=ra, dec=dec, unit=(u.deg, u.deg))
        job = Gaia.cone_search_async(
            coords,
            radius=u.Quantity(radius_arcsec, u.arcsec),
        )
        result = job.get_results()

        if result is None or len(result) == 0:
            return None

        return _gaia_row_to_dict(result[0])

    except Exception as e:
        logger.error(f'Erro no Gaia para coords ({ra},{dec}): {e}')
        return None


def query_gaia_by_name(name: str) -> dict | None:
    '''
    Busca dados Gaia DR3 para um objeto pelo nome.
    '''
    try:
        coords = SkyCoord.from_name(name)
        job = Gaia.cone_search_async(
            coords,
            radius=u.Quantity(5, u.arcsec),
        )
        result = job.get_results()

        if result is None or len(result) == 0:
            return None

        return _gaia_row_to_dict(result[0])

    except Exception as e:
        logger.error(f'Erro no Gaia para {name!r}: {e}')
        return None


def _gaia_row_to_dict(row) -> dict:
    plx     = _safe(row['parallax'])
    plx_err = _safe(row['parallax_error'])
    dist_pc = round(1000 / plx, 2) if plx and plx > 0.01 else None
    dist_ly = round(dist_pc * 3.26156, 2) if dist_pc else None

    return {
        'gaia_source_id':   str(row['source_id']),
        'parallax_mas':     plx,
        'parallax_err':     plx_err,
        'distance_pc':      dist_pc,
        'distance_ly':      dist_ly,
        'pm_ra':            _safe(row['pmra']),
        'pm_dec':           _safe(row['pmdec']),
        'radial_velocity':  _safe(row['radial_velocity']),
        'g_mag':            _safe(row['phot_g_mean_mag']),
        'bp_mag':           _safe(row['phot_bp_mean_mag']),
        'rp_mag':           _safe(row['phot_rp_mean_mag']),
        'temperature_k':    _safe(row['teff_gspphot']),
        'log_g':            _safe(row['logg_gspphot']),
        'metallicity':      _safe(row['mh_gspphot']),
        'distance_gaia_pc': _safe(row['distance_gspphot']),
        'catalog':          'Gaia DR3',
    }