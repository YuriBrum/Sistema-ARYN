/**
 * ARYN - Sistema de Autenticação
 * Regras:
 * - Deslogado: pode usar todo o sistema, carrinho em localStorage
 * - Logado: bloqueia acesso a login/cadastro
 * - Logado: carrinho sincronizado com o banco pela API
 */

const AUTH_KEY = 'aryn_auth';
const USER_KEY = 'aryn_usuario'; // compat com login antigo
const ARYN_API_BASE = window.ARYN_API_BASE || (() => {
    if (window.location.protocol === 'file:') return 'http://localhost:3000/api';

    const usandoServidorDoBackend = window.location.port === '3000';
    const usandoServidorLocalSeparado =
        ['localhost', '127.0.0.1'].includes(window.location.hostname) && !usandoServidorDoBackend;

    return usandoServidorLocalSeparado
        ? 'http://localhost:3000/api'
        : `${window.location.origin}/api`;
})();

async function apiRequest(path, options = {}) {
    if (typeof window.requestApi === 'function') {
        return window.requestApi(path, options);
    }

    const auth = getAuth();
    const headers = { ...(options.headers || {}) };

    if (options.body && typeof options.body !== 'string') {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(options.body);
    }

    if (auth && auth.token) {
        headers.Authorization = `Bearer ${auth.token}`;
    }

    const response = await fetch(`${ARYN_API_BASE}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || data.mensagem || 'Falha na comunicação com a API.');
    }

    return data;
}

function getAuth() {
    try {
        const raw = localStorage.getItem(AUTH_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

function isLoggedIn() {
    const a = getAuth();
    return !!(a && a.logado === true && a.usuario);
}

function getUsuarioLogado() {
    const a = getAuth();
    return a ? a.usuario : null;
}

function login(usuario, token = null, dados = {}) {
    const perfil = typeof usuario === 'string' ? { email: usuario } : usuario;
    const auth = {
        usuario: perfil.email,
        id_usuario: dados.id_usuario || perfil.id_usuario || null,
        id_cliente: dados.id_cliente || perfil.id_cliente || null,
        token,
        logado: true,
        loginAt: Date.now()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    localStorage.setItem(USER_KEY, perfil.email);
    // migra carrinho de visitante para o usuário
    if (typeof migrarCarrinhoVisitanteParaUsuario === 'function') {
        migrarCarrinhoVisitanteParaUsuario(perfil.email);
    }
}

function logout() {
    localStorage.removeItem(AUTH_KEY);
    // mantém USER_KEY para "lembrar-me" se existir flag
    if (localStorage.getItem('aryn_lembrar') !== '1') {
        localStorage.removeItem(USER_KEY);
    }
}

/**
 * Bloqueia páginas de autenticação caso logado.
 * Usar em login.html e cadastro.html no topo do body.
 * Redireciona para ../index.html
 */
function bloquearSeLogado() {
    if (isLoggedIn()) {
        alert('Você já está logado como ' + getUsuarioLogado() + '. Redirecionando para a loja.');
        window.location.href = '../../index.html';
        return true;
    }
    return false;
}

/**
 * Opcional: proteger página que exige login
 * Não usado no momento pois o sistema deve permitir deslogado
 */
function exigirLogin(destino = 'login.html') {
    if (!isLoggedIn()) {
        alert('Faça login para acessar esta página.');
        window.location.href = destino;
        return false;
    }
    return true;
}
