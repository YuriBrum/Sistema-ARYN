/**
 * ARYN - Sistema de Autenticação
 * Regras:
 * - Deslogado: pode usar todo o sistema, carrinho em localStorage
 * - Logado: bloqueia acesso a login/cadastro
 * - Logado: carrinho salvo no "banco" (simulado, trocar por fetch)
 */

const AUTH_KEY = 'aryn_auth';
const USER_KEY = 'aryn_usuario'; // compat com login antigo

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

function login(usuario) {
    const auth = { usuario: usuario, logado: true, loginAt: Date.now() };
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    localStorage.setItem(USER_KEY, usuario);
    // migra carrinho de visitante para o usuário
    if (typeof migrarCarrinhoVisitanteParaUsuario === 'function') {
        migrarCarrinhoVisitanteParaUsuario(usuario);
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
        window.location.href = '../index.html';
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
