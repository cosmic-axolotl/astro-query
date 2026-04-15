from astroquery.jplsbdb import SBDB
import logging

logger = logging.getLogger(__name__)


def _safe(d, key, cast=float, default=None):
    try:
        v = d.get(key)
        if v is None:
            return default
        return cast(v)
    except (ValueError, TypeError):
        return default


def query_small_body(name: str) -> dict | None:
    '''
    Busca dados de um asteroide ou cometa pelo nome.
    Exemplos: 'Ceres', 'Apophis', 'Halley', '99942'
    '''
    try:
        result = SBDB.query(
            name,
            phys=True,
            full_precision=True,
        )

        if not result:
            return None

        return _sbdb_to_dict(result)

    except Exception as e:
        logger.error(f'Erro no SBDB para {name!r}: {e}')
        return None


def _sbdb_to_dict(result: dict) -> dict:
    body  = result.get('object', {})
    orbit = result.get('orbit',  {})
    phys  = result.get('phys_par', {})

    # Determina tipo
    obj_type = 'Asteroid'
    fullname = str(body.get('fullname', '')).strip()
    if any(c in fullname for c in ['P/', 'C/', 'D/', '/']):
        obj_type = 'Comet'

    return {
        'name':               fullname,
        'object_type':        obj_type,
        'spkid':              str(body.get('spkid', '')),
        'neo':                bool(body.get('neo', False)),
        'pha':                bool(body.get('pha', False)),
        # Elementos orbitais
        'semi_major_axis_au': _safe(orbit, 'a'),
        'eccentricity':       _safe(orbit, 'e'),
        'inclination_deg':    _safe(orbit, 'i'),
        'orbital_period_yr':  _safe(orbit, 'per_y'),
        'perihelion_au':      _safe(orbit, 'q'),
        # Propriedades físicas
        'diameter_km':        _safe(phys, 'diameter'),
        'albedo':             _safe(phys, 'albedo'),
        'rotation_h':         _safe(phys, 'rot_per'),
        'abs_magnitude':      _safe(phys, 'H'),
        'taxonomy':           str(phys.get('spec_T', '')).strip(),
        'catalogs':           ['JPL SBDB'],
    }