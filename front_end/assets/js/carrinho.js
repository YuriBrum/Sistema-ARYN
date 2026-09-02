/**
 * ARYN - Carrinho
 * Deslogado: salvo em localStorage (aryn_carrinho_guest)
 * Logado: salvo no "banco" (simulado em localStorage por usuário + pronto para fetch)
 * Para integrar com backend real, troque salvarCarrinhoDB/carregarCarrinhoDB por fetch.
 */

const CART_GUEST_KEY = 'aryn_carrinho_guest';

function getCartDbKey(usuario) {
    if (!usuario) {
        const a = typeof getAuth === 'function' ? getAuth() : null;
        usuario = a ? a.usuario : 'anon';
    }
    return `aryn_carrinho_db_${usuario}`;
}

function getCartKey() {
    if (typeof isLoggedIn === 'function' && isLoggedIn()) {
        return getCartDbKey(getUsuarioLogado());
    }
    return CART_GUEST_KEY;
}

// ---- Simulação de API de banco ----
async function salvarCarrinhoDB(usuario, carrinho) {
    // TODO: substituir por chamada real:
    // return fetch('/api/carrinho', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({usuario, carrinho}) })
    localStorage.setItem(getCartDbKey(usuario), JSON.stringify(carrinho));
    console.log('[DB] Carrinho salvo no BANCO para', usuario, carrinho);
    return true;
}

async function carregarCarrinhoDB(usuario) {
    // TODO: substituir por: return fetch(`/api/carrinho?usuario=${usuario}`).then(r=>r.json())
    const raw = localStorage.getItem(getCartDbKey(usuario));
    try { return raw ? JSON.parse(raw) : []; } catch { return []; }
}

// ---- API pública do carrinho ----
function carregarCarrinho() {
    if (typeof isLoggedIn === 'function' && isLoggedIn()) {
        // síncrono para compatibilidade (lê do localStorage que simula DB)
        const raw = localStorage.getItem(getCartKey());
        try { return raw ? JSON.parse(raw) : []; } catch { return []; }
    } else {
        const raw = localStorage.getItem(CART_GUEST_KEY);
        try { return raw ? JSON.parse(raw) : []; } catch { return []; }
    }
}

async function salvarCarrinho(carrinho) {
    if (typeof isLoggedIn === 'function' && isLoggedIn()) {
        await salvarCarrinhoDB(getUsuarioLogado(), carrinho);
    } else {
        localStorage.setItem(CART_GUEST_KEY, JSON.stringify(carrinho));
        console.log('[LocalStorage] Carrinho visitante salvo', carrinho);
    }
}

async function adicionarAoCarrinho(produto) {
    // produto: {id, nome, preco, qtd, img}
    const carrinho = carregarCarrinho();
    const existente = carrinho.find(p => p.id === produto.id);
    if (existente) {
        existente.qtd += produto.qtd || 1;
    } else {
        carrinho.push({ ...produto, qtd: produto.qtd || 1 });
    }
    await salvarCarrinho(carrinho);
    return carrinho;
}

async function removerDoCarrinho(id) {
    let carrinho = carregarCarrinho();
    carrinho = carrinho.filter(p => String(p.id) !== String(id));
    await salvarCarrinho(carrinho);
    return carrinho;
}

async function atualizarQuantidade(id, novaQtd) {
    const carrinho = carregarCarrinho();
    const item = carrinho.find(p => String(p.id) === String(id));
    if (item) {
        item.qtd = Math.max(1, novaQtd);
        await salvarCarrinho(carrinho);
    }
    return carrinho;
}

function migrarCarrinhoVisitanteParaUsuario(usuario) {
    const guestRaw = localStorage.getItem(CART_GUEST_KEY);
    if (!guestRaw) return;
    let guestCart;
    try { guestCart = JSON.parse(guestRaw); } catch { guestCart = []; }
    if (!guestCart || !guestCart.length) return;

    const dbKey = getCartDbKey(usuario);
    let dbCart = [];
    try { dbCart = JSON.parse(localStorage.getItem(dbKey) || '[]'); } catch { dbCart = []; }

    // merge por id
    guestCart.forEach(gp => {
        const ex = dbCart.find(p => String(p.id) === String(gp.id));
        if (ex) ex.qtd += gp.qtd;
        else dbCart.push(gp);
    });

    localStorage.setItem(dbKey, JSON.stringify(dbCart));
    localStorage.removeItem(CART_GUEST_KEY);
    console.log('[Migração] Carrinho visitante migrado para DB do usuário', usuario, dbCart);
}

// Helper para exibir onde está salvo (debug)
function ondeCarrinhoEstaSalvo() {
    if (typeof isLoggedIn === 'function' && isLoggedIn()) return 'BANCO (simulado por ' + getCartKey() + ')';
    return 'localStorage (' + CART_GUEST_KEY + ')';
}
