from astroquery.jplhorizons import Horizons
from datetime import datetime, timezone, timedelta
import logging

logger = logging.getLogger(__name__)

BODY_IDS = {
    # Planetas
    'mercury':  '199',
    'venus':    '299',
    'earth':    '399',
    'mars':     '499',
    'jupiter':  '599',
    'saturn':   '699',
    'uranus':   '799',
    'neptune':  '899',
    'pluto':    '999',
    # Luas
    'moon':     '301',
    'phobos':   '401',
    'deimos':   '402',
    'io':       '501',
    'europa':   '502',
    'ganymede': '503',
    'callisto': '504',
    'titan':    '606',
    'enceladus':'602',
    'triton':   '801',
    'charon':   '901',
    # Nomes em português
    'mercurio': '199',
    'mercúrio': '199',
    'vênus':    '299',
    'marte':    '499',
    'júpiter':  '599',
    'saturno':  '699',
    'urano':    '799',
    'netuno':   '899',
    'lua':      '301',
    # Sol
    'sun': '10',
    'sol': '10',
    # Sondas
    'voyager1':     '-31',
    'voyager2':     '-32',
    'jwst':         '-170',
    'cassini':      '-82',
    'new horizons': '-98',
}

MOONS = {
    '499': [
        {'name': 'Phobos',   'id': '401'},
        {'name': 'Deimos',   'id': '402'},
    ],
    '599': [
        {'name': 'Io',       'id': '501'},
        {'name': 'Europa',   'id': '502'},
        {'name': 'Ganymede', 'id': '503'},
        {'name': 'Callisto', 'id': '504'},
    ],
    '699': [
        {'name': 'Mimas',     'id': '601'},
        {'name': 'Enceladus', 'id': '602'},
        {'name': 'Tethys',    'id': '603'},
        {'name': 'Dione',     'id': '604'},
        {'name': 'Rhea',      'id': '605'},
        {'name': 'Titan',     'id': '606'},
        {'name': 'Iapetus',   'id': '608'},
    ],
    '799': [
        {'name': 'Miranda',  'id': '705'},
        {'name': 'Ariel',    'id': '701'},
        {'name': 'Umbriel',  'id': '702'},
        {'name': 'Titania',  'id': '703'},
        {'name': 'Oberon',   'id': '704'},
    ],
    '899': [
        {'name': 'Triton',   'id': '801'},
        {'name': 'Nereid',   'id': '802'},
    ],
    '999': [
        {'name': 'Charon',   'id': '901'},
        {'name': 'Nix',      'id': '902'},
        {'name': 'Hydra',    'id': '903'},
    ],
}

MOON_COUNTS = {
    '199': 0,
    '299': 0,
    '399': 1,
    '499': 2,
    '599': 95,
    '699': 146,
    '799': 28,
    '899': 16,
    '999': 5,
}


def _get_epochs():
    now  = datetime.now(timezone.utc)
    stop = now + timedelta(hours=1)
    return {
        'start': now.strftime('%Y-%m-%d %H:%M'),
        'stop':  stop.strftime('%Y-%m-%d %H:%M'),
        'step':  '1h',
    }


def _fetch_ephemeris(body_id: str):
    try:
        obj = Horizons(
            id=body_id,
            location='500@399',
            epochs=_get_epochs(),
        )
        eph = obj.ephemerides()
        if eph is None or len(eph) == 0:
            return None
        return eph[0]
    except Exception as e:
        logger.warning(f'Ephemeris falhou para {body_id}: {e}')
        return None


def query_solar_body(name: str) -> dict | None:
    '''
    Busca posição e dados atuais de um corpo do Sistema Solar.
    Inclui lista de luas conhecidas para planetas.
    '''
    try:
        body_id = BODY_IDS.get(name.lower().strip(), name.strip())

        row = _fetch_ephemeris(body_id)
        if row is None:
            return None

        result = _eph_to_dict(name, row)

        if body_id in MOONS:
            known_moons = MOONS[body_id]
            total       = MOON_COUNTS.get(body_id, len(known_moons))
            result['moons'] = {
                'total_known': total,
                'listed':      known_moons,
                'note':        f'Mostrando {len(known_moons)} luas principais de {total} conhecidas.',
            }

        return result

    except Exception as e:
        logger.error(f'Erro no Horizons para {name!r}: {e}')
        return None


def _eph_to_dict(name: str, row) -> dict:
    def safe(key):
        try:
            v = row[key]
            if v is None:
                return None
            return float(v)
        except Exception:
            return None

    return {
        'name':            name.capitalize(),
        'object_type':     'Solar System Body',
        'ra':              str(row.get('RA', '')),
        'dec':             str(row.get('DEC', '')),
        'distance_au':     safe('delta'),
        'distance_sun_au': safe('r'),
        'apparent_mag':    safe('V'),
        'phase_angle_deg': safe('alpha'),
        'velocity_kms':    safe('delta_rate'),
        'elongation_deg':  safe('elong'),
        'constellation':   str(row.get('constellation', '')),
        'epoch':           str(row.get('datetime_str', '')),
        'catalogs':        ['JPL Horizons'],
    }