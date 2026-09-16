const API_URL = window.ARYN_API_BASE || (() => {
    if (window.location.protocol === 'file:') return 'http://localhost:3000/api';
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return window.location.port === '3000'
            ? `${window.location.origin}/api`
            : 'http://localhost:3000/api';
    }
    return `${window.location.origin}/api`;
})();

function getStoredToken() {
    try {
        const auth = JSON.parse(localStorage.getItem('aryn_auth') || 'null');
        return auth?.token || null;
    } catch {
        return null;
    }
}

async function requestApi(path, options = {}) {
    const headers = { Accept: 'application/json', ...(options.headers || {}) };
    const body = options.body && typeof options.body !== 'string'
        ? JSON.stringify(options.body)
        : options.body;

    if (body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';

    const token = getStoredToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    let response;
    try {
        response = await fetch(`${API_URL}${path}`, { ...options, body, headers });
    } catch {
        throw new Error('Não foi possível conectar ao servidor.');
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(data.message || 'Não foi possível concluir a operação.');
        error.status = response.status;
        throw error;
    }

    return data;
}

window.ARYN_API_URL = API_URL;
window.requestApi = requestApi;
