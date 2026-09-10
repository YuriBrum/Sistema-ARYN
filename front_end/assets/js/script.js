// =============================================
// ARYN - script.js unificado
// =============================================

function paginaLogin() {
    return window.location.pathname.includes('/modelos/')
        ? 'login.html'
        : 'front_end/modelos/login.html';
}

function paginaProduto() {
    return window.location.pathname.includes('/modelos/')
        ? 'produto.html'
        : 'front_end/modelos/produto.html';
}

function exigirLoginParaAcao() {
    if (typeof isLoggedIn === 'function' && isLoggedIn()) return true;
    alert('Faça login para continuar.');
    window.location.href = paginaLogin();
    return false;
}

// --- CORES E OPÇÕES DE PRODUTO ---

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

const PRODUTO_OPCOES = {
    'Ternos ARYN':                  { cores: ['Preto', 'Azul Marinho'],               tamanhos: ['P', 'M', 'G', 'GG'] },
    'Blazer ARYN':                  { cores: ['Preto', 'Cinza'],                      tamanhos: ['P', 'M', 'G', 'GG'] },
    'Smoke Terno ARYN':             { cores: ['Preto', 'Cinza Escuro'],               tamanhos: ['P', 'M', 'G', 'GG'] },
    'Camiseta Social ARYN':         { cores: ['Preto', 'Branco', 'Azul'],             tamanhos: ['P', 'M', 'G', 'GG'] },
    'Camisa Social Slim ARYN':      { cores: ['Branco', 'Azul Claro'],                tamanhos: ['P', 'M', 'G', 'GG'] },
    'Camisa Social Feminina ARYN':  { cores: ['Preto', 'Branco', 'Rosa'],             tamanhos: ['P', 'M', 'G'] },
    'Blazer Feminino ARYN':         { cores: ['Preto', 'Bege'],                       tamanhos: ['P', 'M', 'G'] }
};

function formatarPreco(valor) {
    valor = parseFloat(valor) || 0;
    return "R$ " + valor.toFixed(2).replace(".", ",");
}

// --- FAVORITOS ---

const botoesFavorito = document.querySelectorAll(".favorito");

function favoritosKey() {
    if (typeof getUsuarioLogado !== 'function') return 'aryn_favoritos_db_';
    const u = getUsuarioLogado();
    return 'aryn_favoritos_db_' + (u || 'anon');
}

function carregarFavoritos() {
    try {
        const raw = localStorage.getItem(favoritosKey());
        return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
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

botoesFavorito.forEach(atualizarBotaoFavorito);

botoesFavorito.forEach(botao => {
    botao.addEventListener("click", (e) => {
        e.stopPropagation();

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
        alert('♥ Salvo nas suas curtidas!');
    });
});

// --- CARRINHO -> PÁGINA DO PRODUTO ---

function coletarDadosCard(card) {
    const nomeEl = card.querySelector('h3');
    const precoEl = card.querySelector('h4') || card.querySelector('.preco');
    const imagensEls = card.querySelectorAll('.carrossel .imagem');

    const nome = nomeEl ? nomeEl.textContent.trim() : 'Produto ARYN';
    let preco = 99.90;
    if (precoEl) {
        const txt = precoEl.textContent.replace('R$', '').replace(',', '.').trim();
        preco = parseFloat(txt) || preco;
    }

    const imagens = [];
    imagensEls.forEach(img => {
        if (img.src) imagens.push(img.src);
    });

    return { nome, preco, imagens };
}

function irParaProduto(card) {
    const dados = coletarDadosCard(card);
    localStorage.setItem('aryn_produto_atual', JSON.stringify(dados));
    window.location.href = paginaProduto();
}

const botoesCarrinho = document.querySelectorAll(".carrinho");

botoesCarrinho.forEach(botao => {
    botao.addEventListener("click", (e) => {
        e.stopPropagation();
        const card = botao.closest('.card') || botao.closest('.item');
        if (card) irParaProduto(card);
    });
});

document.querySelectorAll('.card').forEach(card => {
    const carrossel = card.querySelector('.carrossel');
    if (carrossel) {
        carrossel.style.cursor = 'pointer';
        carrossel.addEventListener('click', () => irParaProduto(card));
    }

    const info = card.querySelector('.info');
    if (info) {
        info.style.cursor = 'pointer';
        info.addEventListener('click', () => irParaProduto(card));
    }
});

// --- PÁGINA DO PRODUTO (produto.html) ---

let produtoData = null;
let corSelecionada = null;
let tamanhoSelecionado = null;

function carregarProduto() {
    try {
        const raw = localStorage.getItem('aryn_produto_atual');
        return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
}

function renderizarProduto() {
    const container = document.getElementById('conteudoProduto');
    if (!container) return;

    produtoData = carregarProduto();

    if (!produtoData) {
        container.innerHTML =
            '<div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:#111;">' +
                '<i class="fa-solid fa-triangle-exclamation" style="font-size:50px;color:#aaa;margin-bottom:15px;display:block;"></i>' +
                '<h3>Produto não encontrado</h3>' +
                '<p style="color:#888;margin:10px 0 20px;">Volte à loja e clique em um produto.</p>' +
                '<a href="../../index.html" style="padding:12px 28px;background:#111;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">Ver produtos</a>' +
            '</div>';
        return;
    }

    const nome = produtoData.nome || 'Produto ARYN';
    const preco = parseFloat(produtoData.preco) || 0;
    const imagens = produtoData.imagens || [];
    const opcoes = PRODUTO_OPCOES[nome] || { cores: ['Preto', 'Branco', 'Azul'], tamanhos: ['P', 'M', 'G', 'GG'] };
    const estoque = typeof obterEstoque === 'function' ? obterEstoque(nome) : 0;

    corSelecionada = null;
    tamanhoSelecionado = null;

    const imgsHtml = imagens.map((src, i) =>
        '<img src="' + src + '" class="imagem' + (i === 0 ? ' ativa' : '') + '">'
    ).join('');

    const coresHtml = opcoes.cores.map(cor => {
        const hex = CORES_HEX[cor] || '#cccccc';
        const bordaBranca = ['Branco', 'Bege', 'Azul Claro'].includes(cor);
        return '<button data-cor="' + cor + '" title="' + cor + '" style="background:' + hex + ';' + (bordaBranca ? 'border-color:#ccc;' : '') + '"></button>';
    }).join('');

    const tamanhosHtml = opcoes.tamanhos.map(tam =>
        '<button data-tamanho="' + tam + '">' + tam + '</button>'
    ).join('');

    const estoqueHtml = estoque > 0
        ? '<p class="estoque-texto">' + estoque + ' em estoque</p>'
        : '<p class="estoque-texto sem-estoque">Estoque esgotado</p>';

    container.innerHTML =
        '<div>' +
            '<a href="javascript:history.back()" class="voltar"><i class="fa-solid fa-arrow-left"></i> Voltar</a>' +
            '<div class="produto-galeria">' +
                '<div class="carrossel" id="galeriaCarrossel">' + imgsHtml + '</div>' +
            '</div>' +
        '</div>' +
        '<div class="produto-info-detalhe">' +
            '<p class="marca">ARYN</p>' +
            '<h1>' + nome + '</h1>' +
            '<p class="preco">' + formatarPreco(preco) + '</p>' +
            estoqueHtml +
            '<div class="secao-opcao">' +
                '<label class="label">Cor: <span id="corEscolhida">Selecione</span></label>' +
                '<div class="opcoes-cores-produto" id="opcoesCores">' + coresHtml + '</div>' +
            '</div>' +
            '<div class="secao-opcao">' +
                '<label class="label">Tamanho: <span id="tamanhoEscolhido">Selecione</span></label>' +
                '<div class="opcoes-tamanhos-produto" id="opcoesTamanhos">' + tamanhosHtml + '</div>' +
            '</div>' +
            '<button class="btn-adicionar-carrinho" id="btnAdicionar" disabled>Selecione cor e tamanho</button>' +
        '</div>';

    document.getElementById('opcoesCores').querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('opcoesCores').querySelectorAll('button').forEach(b => b.classList.remove('selecionado'));
            btn.classList.add('selecionado');
            corSelecionada = btn.dataset.cor;
            document.getElementById('corEscolhida').textContent = corSelecionada;
            verificarPronto();
        });
    });

    document.getElementById('opcoesTamanhos').querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('opcoesTamanhos').querySelectorAll('button').forEach(b => b.classList.remove('selecionado'));
            btn.classList.add('selecionado');
            tamanhoSelecionado = btn.dataset.tamanho;
            document.getElementById('tamanhoEscolhido').textContent = tamanhoSelecionado;
            verificarPronto();
        });
    });

    document.getElementById('btnAdicionar').addEventListener('click', async () => {
        if (!corSelecionada || !tamanhoSelecionado) return;

        const produto = {
            id: nome + '|' + preco + '|' + corSelecionada + '|' + tamanhoSelecionado,
            nome: nome,
            preco: preco,
            qtd: 1,
            img: imagens[0] || '',
            cor: corSelecionada,
            tamanho: tamanhoSelecionado
        };

        if (typeof adicionarAoCarrinho === 'function') {
            await adicionarAoCarrinho(produto);
        }

        const btn = document.getElementById('btnAdicionar');
        btn.textContent = '✓ Adicionado ao carrinho';
        btn.style.background = '#1a7a1a';
        setTimeout(() => {
            btn.textContent = 'Adicionar ao carrinho';
            btn.style.background = '';
        }, 2000);
    });

    if (imagens.length > 1) {
        const carrossel = document.getElementById('galeriaCarrossel');
        const imgs = carrossel.querySelectorAll('.imagem');
        let atual = 0;
        setInterval(() => {
            imgs[atual].classList.remove('ativa');
            atual = (atual + 1) % imgs.length;
            imgs[atual].classList.add('ativa');
        }, 2500);
    }
}

function verificarPronto() {
    const btn = document.getElementById('btnAdicionar');
    if (!btn) return;
    if (corSelecionada && tamanhoSelecionado) {
        btn.disabled = false;
        btn.textContent = 'Adicionar ao carrinho';
    } else {
        btn.disabled = true;
        btn.textContent = 'Selecione cor e tamanho';
    }
}

window.addEventListener('DOMContentLoaded', renderizarProduto);

/* Funções dos Pedidos */

const IMG_PADRAO = "../assets/images/mockup.png";

function formatarPreco(valor) {
    return "R$ " + (parseFloat(valor) || 0).toFixed(2).replace(".", ",");
}

// A data é salva no formato "dd/mm/aaaa hh:mm" ou como ISO
function parseData(data) {
    if (!data) return null;
    if (typeof data === 'string' && data.includes('/')) {
        const partes = data.split(/[/ :]/);
        if (partes.length >= 3) {
            const d = parseInt(partes[0], 10);
            const m = parseInt(partes[1], 10) - 1;
            const a = parseInt(partes[2], 10);
            const h = parseInt(partes[3], 10) || 12;
            const min = parseInt(partes[4], 10) || 0;
            return new Date(a, m, d, h, min);
        }
    }
    const d = new Date(data);
    return isNaN(d.getTime()) ? null : d;
}

function formatarData(d) {
    if (!d || isNaN(d.getTime())) return "";
    return d.toLocaleDateString("pt-BR");
}

// Entrega estimada: pedido + 7 dias corridos
function calcularEntrega(dataPedido) {
    if (!dataPedido || isNaN(dataPedido.getTime())) return "Em breve";
    const entrega = new Date(dataPedido);
    entrega.setDate(entrega.getDate() + 7);
    return "Entrega prevista: " + formatarData(entrega);
}

// Normaliza o caminho da imagem (vindo de index => front_end/... ou ../assets/...)
function normalizarImg(src) {
    if (!src) return IMG_PADRAO;
    if (src.indexOf("front_end/") === 0) return "../" + src;
    if (src.indexOf("http") === 0) return src;
    return src;
}

function renderizarPedidos() {
    const aviso = document.getElementById("avisoVisitante");
    const container = document.getElementById("lista-pedidos");
    if (!container) return;

    if (typeof isLoggedIn !== 'function' || !isLoggedIn()) {
        if (aviso) aviso.style.display = "";
        container.innerHTML = "";
        return;
    }
    if (aviso) aviso.style.display = "none";

    const email = getUsuarioLogado();
    const raw = localStorage.getItem("aryn_pedidos_" + email);
    let pedidos = [];
    try { pedidos = raw ? JSON.parse(raw) : []; } catch (e) { pedidos = []; }

    if (!pedidos.length) {
        container.innerHTML =
            '<div class="vazio">' +
                '<i class="fa-solid fa-box-open"></i>' +
                "<h3>Nenhum pedido ainda</h3>" +
                "<p>Seus pedidos aparecerão aqui depois de finalizar uma compra.</p>" +
                '<a href="../../index.html" class="continuar">Ver produtos</a>' +
            "</div>";
        return;
    }

    container.innerHTML = pedidos.map(pedido => {
        const numero = pedido.id || Date.now();
        const dataPedido = formatarData(parseData(pedido.data));
        const entrega = calcularEntrega(parseData(pedido.data));

        const itensHtml = (pedido.itens || []).map(item => {
            const nome = item.nome || "Produto ARYN";
            const qtd = parseInt(item.qtd, 10) || 1;
            const preco = parseFloat(item.preco) || 0;
            const det = [];
            if (item.cor) det.push(item.cor);
            if (item.tamanho) det.push("Tam. " + item.tamanho);
            const detalheStr = det.length ? " · " + det.join(" · ") : "";

            return (
                '<div class="pedido-item">' +
                    '<img src="' + normalizarImg(item.img) + '" alt="' + nome + '">' +
                    '<div class="info">' +
                        '<p class="nome">' + nome + '</p>' +
                        '<p class="detalhes">' + qtd + "x " + detalheStr + '</p>' +
                    "</div>" +
                    '<div class="valor-item">' +
                        '<p class="unit">' + formatarPreco(preco) + " cada</p>" +
                        '<p class="total">' + formatarPreco(preco * qtd) + "</p>" +
                    "</div>" +
                "</div>"
            );
        }).join("");

        return (
            '<div class="pedido-card">' +
                '<div class="pedido-topo">' +
                    '<span class="numero"><i class="fa-solid fa-receipt"></i> Pedido #' + numero + "</span>" +
                    '<span class="data-pedido">' + dataPedido + "</span>" +
                    '<span class="status-badge"><i class="fa-solid fa-check"></i> Confirmado</span>' +
                "</div>" +
                '<div class="pedido-corpo">' + itensHtml + "</div>" +
                '<div class="pedido-rodape">' +
                    '<div class="pedido-entrega">' +
                        '<i class="fa-solid fa-truck-fast"></i>' +
                        "<span>" + entrega + "</span>" +
                    "</div>" +
                    '<div class="pedido-total-final">' +
                        "<small>Total do pedido</small>" +
                        "<strong>" + formatarPreco(pedido.total) + "</strong>" +
                    "</div>" +
                "</div>" +
            "</div>"
        );
    }).join("");
}

window.addEventListener("DOMContentLoaded", renderizarPedidos);