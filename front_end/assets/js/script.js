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

// --- FAVORITOS ---
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

// --- MODAL COR/TAMANHO ---

const CORES_HEX = {
    'Preto':        '#111111',
    'Branco':       '#FFFFFF',
    'Azul':         '#1a3c7a',
    'Cinza':        '#8a8a8a',
    'Cinza Escuro': '#3e3e3e',
    'Azul Marinho': '#0a1f44',
    'Azul Claro':   '#7fb3e0',
    'Rosa':         '#e8729a',
    'Bege':         '#d9c9a8',
    'Vermelho':     '#c0392b'
};

const CORES_PADRAO = ['Preto', 'Branco', 'Azul'];
const TAMANHOS_PADRAO = ['P', 'M', 'G', 'GG'];

const PRODUTO_OPCOES = {
    'Camisa Social Polo ARYN':   { cores: ['Preto', 'Branco', 'Azul'],           tamanhos: ['P', 'M', 'G', 'GG'] },
    'Blazer ARYN':               { cores: ['Preto', 'Cinza'],                    tamanhos: ['P', 'M', 'G', 'GG'] },
    'Smoke Terno ARYN':          { cores: ['Preto', 'Cinza Escuro'],             tamanhos: ['P', 'M', 'G', 'GG'] },
    'Terno ARYN':                { cores: ['Preto', 'Azul Marinho'],             tamanhos: ['P', 'M', 'G', 'GG'] },
    'Camisa Social Slim ARYN':   { cores: ['Branco', 'Azul Claro'],              tamanhos: ['P', 'M', 'G', 'GG'] },
    'Camisa Social ARYN':        { cores: ['Preto', 'Branco', 'Azul'],           tamanhos: ['P', 'M', 'G', 'GG'] },
    'Camisa Social Feminina ARYN': { cores: ['Preto', 'Branco', 'Rosa'],         tamanhos: ['P', 'M', 'G'] },
    'Blazer Feminino ARYN':      { cores: ['Preto', 'Bege'],                     tamanhos: ['P', 'M', 'G'] }
};

function criarModalEstilo() {
    if (document.getElementById('aryn-modal-estilo')) return;
    const style = document.createElement('style');
    style.id = 'aryn-modal-estilo';
    style.textContent = `
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,.6);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }
        .modal-overlay.aberto { display: flex; }
        .modal-estilo {
            background: #fff;
            border-radius: 16px;
            padding: 30px;
            max-width: 460px;
            width: 90%;
            color: #111;
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-estilo .fechar-modal {
            position: absolute;
            top: 12px; right: 16px;
            background: none; border: 0;
            font-size: 26px; cursor: pointer; color: #888;
        }
        .modal-estilo .produto-info {
            display: flex; gap: 16px; align-items: center;
            margin-bottom: 22px;
        }
        .modal-estilo .produto-info img {
            width: 90px; height: 100px;
            object-fit: contain; border-radius: 10px;
            background: #f5f5f5;
        }
        .modal-estilo .produto-info h3 { margin: 0 0 4px; font-size: 17px; }
        .modal-estilo .produto-info h4 { margin: 0; font-size: 22px; font-weight: 300; }
        .modal-estilo .secao-label {
            font-weight: bold; font-size: 14px;
            margin-bottom: 10px; display: block;
        }
        .modal-estilo .opcoes-cores {
            display: flex; gap: 12px; flex-wrap: wrap;
            margin-bottom: 20px;
        }
        .modal-estilo .opcoes-cores button {
            width: 42px; height: 42px;
            border-radius: 50%;
            border: 3px solid #ddd;
            cursor: pointer;
            transition: .2s;
            position: relative;
            padding: 0;
        }
        .modal-estilo .opcoes-cores button:hover {
            transform: scale(1.1);
        }
        .modal-estilo .opcoes-cores button.selecionado {
            border-color: #d91d1d;
            box-shadow: 0 0 0 2px #d91d1d;
            transform: scale(1.1);
        }
        .modal-estilo .opcoes-cores button.selecionado::after {
            content: '\\2713';
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            font-size: 16px;
            font-weight: bold;
        }
        .modal-estilo .opcoes-cores button[data-cor="Branco"].selecionado::after,
        .modal-estilo .opcoes-cores button[data-cor="Bege"].selecionado::after,
        .modal-estilo .opcoes-cores button[data-cor="Azul Claro"].selecionado::after {
            color: #111;
        }
        .modal-estilo .opcoes-cores button:not([data-cor="Branco"]):not([data-cor="Bege"]):not([data-cor="Azul Claro"]):not([data-cor="Rosa"]).selecionado::after {
            color: #fff;
        }
        .modal-estilo .cor-label {
            text-align: center;
            font-size: 11px;
            color: #555;
            margin-top: -6px;
            margin-bottom: 12px;
        }
        .modal-estilo .opcoes-tamanhos {
            display: flex; gap: 10px; flex-wrap: wrap;
            margin-bottom: 24px;
        }
        .modal-estilo .opcoes-tamanhos button {
            width: 48px; height: 48px;
            border: 2px solid #ddd;
            border-radius: 10px;
            background: #fff;
            cursor: pointer;
            font-size: 15px;
            font-weight: bold;
            transition: .2s;
        }
        .modal-estilo .opcoes-tamanhos button:hover {
            border-color: #111;
        }
        .modal-estilo .opcoes-tamanhos button.selecionado {
            border-color: #d91d1d;
            background: #fdf0f0;
            color: #d91d1d;
        }
        .modal-estilo .btn-adicionar {
            width: 100%;
            padding: 14px;
            border: 0;
            border-radius: 8px;
            background: #d91d1d;
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: .2s;
        }
        .modal-estilo .btn-adicionar:hover { background: #b01313; }
        .modal-estilo .btn-adicionar:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
}

function criarModalHTML() {
    if (document.getElementById('modalEstilo')) return;
    const modal = document.createElement('div');
    modal.id = 'modalEstilo';
    modal.className = 'modal-overlay';
    modal.innerHTML =
        '<div class="modal-estilo">' +
            '<button class="fechar-modal" onclick="fecharModalEstilo()">&times;</button>' +
            '<div class="produto-info">' +
                '<img id="modalImg" src="" alt="">' +
                '<div><h3 id="modalNome"></h3><h4 id="modalPreco"></h4></div>' +
            '</div>' +
            '<label class="secao-label">Cor</label>' +
            '<div class="opcoes-cores" id="modalCores"></div>' +
            '<label class="secao-label">Tamanho</label>' +
            '<div class="opcoes-tamanhos" id="modalTamanhos"></div>' +
            '<button class="btn-adicionar" id="modalBtnAdicionar" disabled>Selecione cor e tamanho</button>' +
        '</div>';
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModalEstilo();
    });
}

let modalProdutoAtual = null;
let modalCorSelecionada = null;
let modalTamanhoSelecionado = null;

function abrirModalEstilo(card) {
    if (!exigirLoginParaAcao()) return;

    const nomeEl = card.querySelector('h3');
    const precoEl = card.querySelector('h4') || card.querySelector('.preco');
    const imgEl = card.querySelector('img');
    const nome = nomeEl ? nomeEl.textContent.trim() : 'Produto ARYN';
    let preco = 99.90;
    if (precoEl) {
        const txt = precoEl.textContent.replace('R$', '').replace(',', '.').trim();
        preco = parseFloat(txt) || preco;
    }

    const opcoes = PRODUTO_OPCOES[nome] || { cores: CORES_PADRAO, tamanhos: TAMANHOS_PADRAO };

    modalProdutoAtual = {
        id: nome + '|' + preco,
        nome: nome,
        preco: preco,
        img: imgEl ? imgEl.src : ''
    };
    modalCorSelecionada = null;
    modalTamanhoSelecionado = null;

    criarModalEstilo();
    criarModalHTML();

    document.getElementById('modalImg').src = modalProdutoAtual.img;
    document.getElementById('modalNome').textContent = nome;
    document.getElementById('modalPreco').textContent = 'R$ ' + preco.toFixed(2).replace('.', ',');

    const coresContainer = document.getElementById('modalCores');
    coresContainer.innerHTML = opcoes.cores.map(cor => {
        const hex = CORES_HEX[cor] || '#cccccc';
        const bordaBranca = ['Branco', 'Bege', 'Azul Claro'].includes(cor);
        return '<button data-cor="' + cor + '" title="' + cor + '" style="background:' + hex + ';' + (bordaBranca ? 'border-color:#ccc;' : '') + '"></button>';
    }).join('');

    const tamanhosContainer = document.getElementById('modalTamanhos');
    tamanhosContainer.innerHTML = opcoes.tamanhos.map(tam =>
        '<button data-tamanho="' + tam + '">' + tam + '</button>'
    ).join('');

    const btnAdicionar = document.getElementById('modalBtnAdicionar');
    btnAdicionar.disabled = true;
    btnAdicionar.textContent = 'Selecione cor e tamanho';

    coresContainer.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            coresContainer.querySelectorAll('button').forEach(b => b.classList.remove('selecionado'));
            btn.classList.add('selecionado');
            modalCorSelecionada = btn.dataset.cor;
            verificarModalPronto();
        });
    });

    tamanhosContainer.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            tamanhosContainer.querySelectorAll('button').forEach(b => b.classList.remove('selecionado'));
            btn.classList.add('selecionado');
            modalTamanhoSelecionado = btn.dataset.tamanho;
            verificarModalPronto();
        });
    });

    btnAdicionar.onclick = async () => {
        if (!modalCorSelecionada || !modalTamanhoSelecionado) return;

        const produto = {
            id: modalProdutoAtual.id + '|' + modalCorSelecionada + '|' + modalTamanhoSelecionado,
            nome: modalProdutoAtual.nome,
            preco: modalProdutoAtual.preco,
            qtd: 1,
            img: modalProdutoAtual.img,
            cor: modalCorSelecionada,
            tamanho: modalTamanhoSelecionado
        };

        if (typeof adicionarAoCarrinho === 'function') {
            await adicionarAoCarrinho(produto);
        }

        fecharModalEstilo();

        const botaoCarrinho = card.querySelector('.carrinho');
        if (botaoCarrinho) {
            const onde = typeof ondeCarrinhoEstaSalvo === 'function' ? ondeCarrinhoEstaSalvo() : 'localStorage';
            botaoCarrinho.textContent = "✓ Adicionado (" + modalCorSelecionada + " / " + modalTamanhoSelecionado + ")";
            setTimeout(() => { botaoCarrinho.textContent = "+ Carrinho"; }, 1800);
        }
    };

    document.getElementById('modalEstilo').classList.add('aberto');
}

function verificarModalPronto() {
    const btn = document.getElementById('modalBtnAdicionar');
    if (!btn) return;
    if (modalCorSelecionada && modalTamanhoSelecionado) {
        btn.disabled = false;
        btn.textContent = 'Adicionar ao carrinho';
    } else {
        btn.disabled = true;
        btn.textContent = 'Selecione cor e tamanho';
    }
}

function fecharModalEstilo() {
    const modal = document.getElementById('modalEstilo');
    if (modal) modal.classList.remove('aberto');
    modalProdutoAtual = null;
    modalCorSelecionada = null;
    modalTamanhoSelecionado = null;
}

// --- CARRINHO ---

const botoesCarrinho = document.querySelectorAll(".carrinho");

botoesCarrinho.forEach(botao => {

    botao.addEventListener("click", () => {
        const card = botao.closest('.card') || botao.closest('.item');
        if (card) {
            abrirModalEstilo(card);
        }
    });

});
