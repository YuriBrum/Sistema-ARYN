// Página de login muda conforme a página atual
function paginaLogin() {
    return window.location.pathname.includes('/modelos/')
        ? 'login.html'
        : 'front_end/modelos/login.html';
}

// Garante que só usuário logado pode favoritar/adicionar ao carrinho
function exigirLoginParaAcao() {
    if (typeof isLoggedIn === 'function' && isLoggedIn()) {
        return true;
    }
    alert('Faça login para continuar.');
    window.location.href = paginaLogin();
    return false;
}

const botoesFavorito = document.querySelectorAll(".favorito");

function favoritosKey() {
    return 'aryn_favoritos_db_' + getUsuarioLogado();
}

function carregarFavoritos() {
    try {
        const raw = localStorage.getItem(favoritosKey());
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function salvarFavoritos(lista) {
    localStorage.setItem(favoritosKey(), JSON.stringify(lista));
}

function favoritoProdutoId(card) {
    if (!card) return 'geral-' + Date.now();
    const nomeEl = card.querySelector('h3');
    const precoEl = card.querySelector('h4') || card.querySelector('.preco');
    const nome = nomeEl ? nomeEl.textContent.trim() : 'Produto ARYN';
    let preco = 99.90;
    if (precoEl) {
        const txt = precoEl.textContent.replace('R$', '').replace(',', '.').trim();
        preco = parseFloat(txt) || preco;
    }
    return nome + '|' + preco;
}

function favoritoContido(lista, id) {
    return (lista || []).some(item => String(item.id || item) === String(id));
}

function removerFavorito(lista, id) {
    return (lista || []).filter(item => String(item.id || item) !== String(id));
}

function atualizarBotaoFavorito(botao) {
    const card = botao.closest('.card') || botao.closest('.item');
    const curtido = favoritoContido(carregarFavoritos(), favoritoProdutoId(card));
    botao.textContent = '❤ ' + (curtido ? 1 : 0);
    botao.classList.toggle('curtido', curtido);
}

if (typeof isLoggedIn === 'function' && isLoggedIn()) {
    botoesFavorito.forEach(atualizarBotaoFavorito);
}

botoesFavorito.forEach(botao => {

    botao.addEventListener("click", () => {

        if (!exigirLoginParaAcao()) return;

        const card = botao.closest('.card') || botao.closest('.item');
        const id = favoritoProdutoId(card);
        const favoritos = carregarFavoritos();
        const curtido = favoritoContido(favoritos, id);

        if (curtido) {
            salvarFavoritos(removerFavorito(favoritos, id));
        } else {
            const nomeEl = card ? card.querySelector('h3') : null;
            const imgEl = card ? card.querySelector('img') : null;
            salvarFavoritos(favoritos.concat({
                id: id,
                nome: nomeEl ? nomeEl.textContent.trim() : 'Produto ARYN',
                preco: parseFloat(id.split('|')[1]) || 99.90,
                img: imgEl ? imgEl.src : ''
            }));
        }

        atualizarBotaoFavorito(botao);

    });

});

const botoesCarrinho = document.querySelectorAll(".carrinho");

botoesCarrinho.forEach(botao => {

    botao.addEventListener("click", async () => {

        if (!exigirLoginParaAcao()) return;

        // Tenta usar sistema de carrinho com auth (guest = localStorage, logado = banco)
        const card = botao.closest('.card') || botao.closest('.item');
        let produto = null;
        if (card) {
            const nomeEl = card.querySelector('h3');
            const precoEl = card.querySelector('h4') || card.querySelector('.preco');
            const imgEl = card.querySelector('img');
            const nome = nomeEl ? nomeEl.textContent.trim() : 'Produto ARYN';
            let preco = 99.90;
            if (precoEl) {
                const txt = precoEl.textContent.replace('R$', '').replace(',', '.').trim();
                preco = parseFloat(txt) || preco;
            }
            const id = nome + '|' + preco; // id simples baseado em nome+preço
            produto = { id, nome, preco, qtd: 1, img: imgEl ? imgEl.src : '' };
        } else {
            produto = { id: 'geral-' + Date.now(), nome: 'Produto ARYN', preco: 99.90, qtd: 1 };
        }

        if (typeof adicionarAoCarrinho === 'function') {
            await adicionarAoCarrinho(produto);
            const onde = typeof ondeCarrinhoEstaSalvo === 'function' ? ondeCarrinhoEstaSalvo() : 'localStorage';
            botao.textContent = "✓ Adicionado (" + (onde.includes('BANCO') ? 'banco' : 'visitante') + ")";
        } else {
            // fallback antigo - sem auth.js carregado
            botao.textContent = "✓ Adicionado";
        }
        setTimeout(() => { botao.textContent = "+ Carrinho"; }, 1800);
    });

});