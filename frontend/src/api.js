import axios from 'axios';

const BASE_URL = 'https://astroquery-api.onrender.com';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
});

export async function searchObject(name, options = {}) {
    const params = {
        name,
        include_hipparcos: options.hipparcos ?? true,
        include_2mass: options.twoMass ?? true,
        include_ads: options.ads ?? false,
        ads_limit: options.adsLimit ?? 3,
    };
    const response = await api.get('/search/object', { params });
    return response.data;
}

export async function searchByType(query, limit = 20) {
    const response = await api.get('/search/type', { params: { query, limit } });
    return response.data;
}


export async function checkHealth() {
    const response = await api.get('/');
    return response.data;
}

export async function searchCluster(name, limit = 50) {
    try {
        const response = await api.get('/search/cluster', { params: { name, limit } });
        return response.data;
    } catch (err) {
        console.error('searchCluster error:', err.response?.status, err.response?.data);
        throw err;
    }
}

export async function searchPlanet(name) {
    const response = await api.get('/search/planet', { params: { name } });
    return response.data;
}

export async function searchExoplanet(name, host = null, habitable = false, limit = 20) {
    const params = { limit };
    if (name) params.name = name;
    if (host) params.host = host;
    if (habitable) params.habitable = true;
    const response = await api.get('/search/exoplanet', { params });
    return response.data;
}

export async function searchSmallBody(name) {
    const response = await api.get('/search/smallbody', { params: { name } });
    return response.data;
}