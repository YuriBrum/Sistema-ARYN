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

function exigirLoginParaAcao(mensagem) {
    if (typeof isLoggedIn === 'function' && isLoggedIn()) return true;
    alert(mensagem || 'Faça login para continuar.');
    window.location.href = paginaLogin();
    return false;
}

async function sincronizarProdutosComApi() {
    if (typeof apiRequest !== 'function') return;

    const cards = document.querySelectorAll('.card');
    if (!cards.length) return;

    try {
        const resposta = await apiRequest('/produtos');
        const produtos = resposta.data || [];

        cards.forEach((card, index) => {
            const nome = card.querySelector('h3')?.textContent.trim();
            const produto = produtos.find(item => item.nome === nome) || produtos[index];
            if (produto) {
                card.dataset.produtoId = produto.id_produto;
                card.dataset.produtoImagem = produto.imagem || '';
                const nomeEl = card.querySelector('h3');
                const precoEl = card.querySelector('h4');
                const categoriaEl = card.querySelector('.info span');
                const estoqueEl = card.querySelector('.info p');
                if (nomeEl) nomeEl.textContent = produto.nome;
                if (precoEl) precoEl.textContent = formatarPreco(produto.preco);
                if (categoriaEl) categoriaEl.textContent = produto.categoria_nome || produto.categoria || 'ARYN';
                if (estoqueEl && produto.estoque !== undefined) estoqueEl.textContent = `${produto.estoque} em estoque`;
                if (produto.imagem) {
                    const imagem = card.querySelector('.carrossel .imagem');
                    if (imagem) imagem.src = produto.imagem;
                }
            }
        });
    } catch (error) {
        console.warn('Não foi possível carregar os produtos da API:', error.message);
    }
}

sincronizarProdutosComApi();

// --- CORES E OPÇÕES DE PRODUTO ---

const CORES_HEX = {
    'Preto':         '#111111',
    'Branco':        '#FFFFFF',
    'Bege':          '#d9c9a8',
    'Vermelho Vinho': '#722F37'
};

const PRODUTO_OPCOES = {
    'Ternos ARYN':                  { cores: ['Preto', 'Branco', 'Vermelho Vinho'],   tamanhos: ['P', 'M', 'G', 'GG'] },
    'Blazer ARYN':                  { cores: ['Preto', 'Branco', 'Vermelho Vinho'],   tamanhos: ['P', 'M', 'G', 'GG'] },
    'Smoke Terno ARYN':             { cores: ['Preto', 'Branco', 'Vermelho Vinho'],   tamanhos: ['P', 'M', 'G', 'GG'] },
    'Smokes ARYN':                  { cores: ['Preto', 'Branco', 'Vermelho Vinho'],   tamanhos: ['P', 'M', 'G', 'GG'] },
    'Camiseta Social ARYN':         { cores: ['Preto', 'Branco', 'Vermelho Vinho'],   tamanhos: ['P', 'M', 'G', 'GG'] },
    'Camisa Social Slim ARYN':      { cores: ['Preto', 'Branco', 'Vermelho Vinho'],   tamanhos: ['P', 'M', 'G', 'GG'] },
    'Ternos Femininos ARYN':        { cores: ['Preto', 'Branco', 'Vermelho Vinho', 'Bege'], tamanhos: ['P', 'M', 'G'] },
    'Blazer Feminino ARYN':         { cores: ['Preto', 'Branco', 'Vermelho Vinho', 'Bege'], tamanhos: ['P', 'M', 'G'] }
};

function formatarPreco(valor) {
    valor = parseFloat(valor) || 0;
    const partes = valor.toFixed(2).split('.');
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return "R$ " + partes.join(',');
}

function parsePreco(texto) {
    const s = String(texto == null ? '' : texto).replace(/[^\d.,]/g, '');
    if (!s) return 0;
    const ultVirg = s.lastIndexOf(',');
    const ultPonto = s.lastIndexOf('.');

    if (ultVirg > -1 && ultPonto > -1) {
        const idx = Math.max(ultVirg, ultPonto);
        const inteiro = s.slice(0, idx).replace(/[.,]/g, '');
        const decimal = s.slice(idx + 1);
        return parseFloat((inteiro || '0') + '.' + decimal) || 0;
    }

    if (ultVirg > -1) {
        const dec = s.length - ultVirg - 1;
        if (dec === 2) return parseFloat(s.replace(',', '.')) || 0;
        return parseFloat(s.replace(/,/g, '')) || 0;
    }

    if (ultPonto > -1) {
        const dec = s.length - ultPonto - 1;
        if (dec === 2) return parseFloat(s) || 0;
        return parseFloat(s.replace(/\./g, '')) || 0;
    }

    return parseFloat(s) || 0;
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

// --- AVALIAÇÕES ---

const AVALIACOES_KEY = 'aryn_avaliacoes';

function carregarAvaliacoes() {
    try { return JSON.parse(localStorage.getItem(AVALIACOES_KEY) || '{}'); } catch (e) { return {}; }
}

function salvarAvaliacoes(objeto) {
    localStorage.setItem(AVALIACOES_KEY, JSON.stringify(objeto));
}

function mediaAvaliacao(nome) {
    const lista = (carregarAvaliacoes() || {})[nome] || [];
    if (!lista.length) return 0;
    return lista.reduce((s, a) => s + (Number(a.estrelas) || 0), 0) / lista.length;
}

function estrelasHtml(nota) {
    nota = Math.round(Number(nota) || 0);
    let s = '';
    for (let i = 1; i <= 5; i++) s += i <= nota ? '★' : '☆';
    return s;
}

function favoritoProdutoId(card) {
    if (!card) return 'geral-' + Date.now();
    const nomeEl = card.querySelector('h3');
    const precoEl = card.querySelector('h4') || card.querySelector('.preco');
    const nome = nomeEl ? nomeEl.textContent.trim() : 'Produto ARYN';
    let preco = 99.90;
    if (precoEl) {
        preco = parsePreco(precoEl.textContent);
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

        if (!exigirLoginParaAcao('Você precisa ter uma conta salva e logada para curtir produtos.')) {
            return;
        }

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

// --- CARRINHO -> PÁGINA DO PRODUTO ---

function coletarDadosCard(card) {
    const nomeEl = card.querySelector('h3');
    const precoEl = card.querySelector('h4') || card.querySelector('.preco');
    const imagensEls = card.querySelectorAll('.carrossel .imagem');

    const nome = nomeEl ? nomeEl.textContent.trim() : 'Produto ARYN';
    let preco = 99.90;
    if (precoEl) {
        preco = parsePreco(precoEl.textContent);
    }

    const imagens = [];
    imagensEls.forEach(img => {
        if (img.src) imagens.push(img.src);
    });

    const promo = !!(card && (card.querySelector('.selo-promo') || card.querySelector('.preco-antigo')));

    return { nome, preco, imagens, promo };
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

function corDoSrc(src) {
    const base = String(src || '').split('/').pop().replace(/\.[^.?#]+$/, '').toLowerCase();
    if (base.endsWith('bg')) return 'Bege';
    const ult = base[base.length - 1];
    if (ult === 'p') return 'Preto';
    if (ult === 'b') return 'Branco';
    if (ult === 'v') return 'Vermelho Vinho';
    return null;
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

    let coresDisponiveis = opcoes.cores.filter(cor => imagens.some(src => corDoSrc(src) === cor));
    let imagensFiltradas = imagens.filter(src => {
        const c = corDoSrc(src);
        return c === null || coresDisponiveis.includes(c);
    });

    if (coresDisponiveis.length === 0) {
        coresDisponiveis = opcoes.cores;
    }

    corSelecionada = null;
    tamanhoSelecionado = null;

    const imgsHtml = imagensFiltradas.map((src, i) =>
        '<img src="' + src + '" class="imagem' + (i === 0 ? ' ativa' : '') + '">'
    ).join('');

    const coresHtml = coresDisponiveis.map(cor => {
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
        '</div>' +
        '<div class="avaliacoes" id="blocoAvaliacoes">' +
            '<h3 class="avaliacoes-titulo">Deixe sua avaliação</h3>' +
            '<div class="estrelas-input" id="estrelasInput">' +
                '<span data-val="1">★</span><span data-val="2">★</span><span data-val="3">★</span><span data-val="4">★</span><span data-val="5">★</span>' +
            '</div>' +
            '<textarea id="textoAvaliacao" rows="3" placeholder="Escreva o que achou do produto..."></textarea>' +
            '<button type="button" class="btn-avaliacao" id="btnAvaliacao">Enviar avaliação</button>' +
            '<div class="lista-avaliacoes" id="listaAvaliacoes"></div>' +
        '</div>';

    const galeriaImg = document.getElementById('galeriaCarrossel');
    const imgsGaleria = galeriaImg ? galeriaImg.querySelectorAll('.imagem') : [];
    let corGaleria = null;
    let indiceImg = 0;
    let intervaloImg = null;

    function corDaImagem(img) {
        const base = String(img.getAttribute('src') || img.src || '')
            .split('/').pop().replace(/\.[^.?#]+$/, '').toLowerCase();
        if (base.endsWith('bg')) return 'Bege';
        const ult = base[base.length - 1];
        if (ult === 'p') return 'Preto';
        if (ult === 'b') return 'Branco';
        if (ult === 'v') return 'Vermelho Vinho';
        return null;
    }

    const imagensPorCor = {};
    Array.prototype.forEach.call(imgsGaleria, img => {
        const c = corDaImagem(img);
        if (c) (imagensPorCor[c] = imagensPorCor[c] || []).push(img);
    });

    function grupoDeImagens() {
        if (corGaleria && imagensPorCor[corGaleria] && imagensPorCor[corGaleria].length) {
            return imagensPorCor[corGaleria];
        }
        return Array.prototype.slice.call(imgsGaleria);
    }

    function mostrarImagem(grupo, indice) {
        imgsGaleria.forEach(img => img.classList.remove('ativa'));
        if (grupo[indice]) grupo[indice].classList.add('ativa');
    }

    function aplicarCorGaleria() {
        corGaleria = corSelecionada;
        indiceImg = 0;
        mostrarImagem(grupoDeImagens(), 0);
    }

    function resetarGaleria() {
        corGaleria = null;
        indiceImg = 0;
        mostrarImagem(grupoDeImagens(), 0);
    }

    function obterImagemSelecionada() {
        if (corSelecionada && imagensPorCor[corSelecionada] && imagensPorCor[corSelecionada].length) {
            return imagensPorCor[corSelecionada][0].getAttribute('src') || imagensPorCor[corSelecionada][0].src || '';
        }
        return '';
    }

    document.getElementById('opcoesCores').querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('opcoesCores').querySelectorAll('button').forEach(b => b.classList.remove('selecionado'));
            btn.classList.add('selecionado');
            corSelecionada = btn.dataset.cor;
            document.getElementById('corEscolhida').textContent = corSelecionada;
            verificarPronto();
            aplicarCorGaleria();
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
            id_produto: produtoData.id_produto || null,
            id: nome + '|' + preco + '|' + corSelecionada + '|' + tamanhoSelecionado,
            nome: nome,
            preco: preco,
            qtd: 1,
            img: obterImagemSelecionada() || imagens[0] || '',
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

    // --- AVALIAÇÕES (deixar nota + comentário abaixo da foto) ---
    const estrelasEls = document.querySelectorAll('#estrelasInput span');
    let notaEscolhida = 0;
    function pintarEstrelas(nota) {
        estrelasEls.forEach(sp => sp.classList.toggle('ativa', Number(sp.dataset.val) <= nota));
    }
    estrelasEls.forEach(sp => sp.addEventListener('click', () => {
        notaEscolhida = Number(sp.dataset.val);
        pintarEstrelas(notaEscolhida);
    }));

    function renderizarListaAvaliacoes() {
        const listaEl = document.getElementById('listaAvaliacoes');
        if (!listaEl) return;
        const itens = (carregarAvaliacoes()[nome] || []).slice().reverse();
        if (!itens.length) {
            listaEl.innerHTML = '<p class="sem-avaliacoes">Ainda não há avaliações para este produto.</p>';
            return;
        }
        listaEl.innerHTML = itens.map(av =>
            '<div class="avaliacao-item">' +
                '<div class="avaliacao-topo">' +
                    '<span class="estrelas">' + estrelasHtml(av.estrelas) + '</span>' +
                    '<span class="data">' + (av.data || '') + '</span>' +
                '</div>' +
                (av.texto ? '<p class="texto">' + String(av.texto).replace(/</g, '&lt;') + '</p>' : '') +
            '</div>'
        ).join('');
    }

    renderizarListaAvaliacoes();

    document.getElementById('btnAvaliacao').addEventListener('click', () => {
        if (!notaEscolhida) {
            alert('Escolha quantas estrelas você quer dar (1 a 5).');
            return;
        }
        const texto = document.getElementById('textoAvaliacao').value.trim();
        const todas = carregarAvaliacoes();
        (todas[nome] = todas[nome] || []).push({
            estrelas: notaEscolhida,
            texto: texto,
            data: new Date().toLocaleDateString('pt-BR')
        });
        salvarAvaliacoes(todas);
        renderizarListaAvaliacoes();
        notaEscolhida = 0;
        pintarEstrelas(0);
        document.getElementById('textoAvaliacao').value = '';
        alert('Avaliação enviada. Obrigado!');
    });

    if (imgsGaleria.length > 1) {
        const avancar = () => {
            const grupo = grupoDeImagens();
            mostrarImagem(grupo, indiceImg);
            indiceImg = (indiceImg + 1) % grupo.length;
            mostrarImagem(grupo, indiceImg);
        };
        galeriaImg.addEventListener('mouseenter', () => {
            if (!intervaloImg) intervaloImg = setInterval(avancar, 2500);
        });
        galeriaImg.addEventListener('mouseleave', () => {
            if (intervaloImg) { clearInterval(intervaloImg); intervaloImg = null; }
            if (corGaleria && imagensPorCor[corGaleria] && imagensPorCor[corGaleria].length) {
                indiceImg = 0;
                mostrarImagem(imagensPorCor[corGaleria], 0);
            } else {
                resetarGaleria();
            }
        });
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

const IMG_PADRAO_PEDIDOS = "../assets/images/as_cb.jpg";

function formatarPreco(valor) {
    valor = parseFloat(valor) || 0;
    const partes = valor.toFixed(2).split('.');
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return "R$ " + partes.join(',');
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
    if (!src) return IMG_PADRAO_PEDIDOS;
    if (src.indexOf("front_end/") === 0) return "../" + src;
    if (src.indexOf("http") === 0) return src;
    return src;
}

function renderizarPedidos() {
    const aviso = document.getElementById("avisoVisitante");
    const container = document.getElementById("lista-pedidos");
    if (!container) return;

    const logado = typeof isLoggedIn === 'function' && isLoggedIn();
    const pedidosKey = logado ? 'aryn_pedidos_' + getUsuarioLogado() : 'aryn_pedidos_anon';
    const raw = localStorage.getItem(pedidosKey);
    let pedidos = [];
    try { pedidos = raw ? JSON.parse(raw) : []; } catch (e) { pedidos = []; }

    if (!pedidos.length) {
        if (aviso) aviso.style.display = logado ? "none" : "";
        container.innerHTML =
            '<div class="vazio">' +
                '<i class="fa-solid fa-box-open"></i>' +
                "<h3>Nenhum pedido ainda</h3>" +
                "<p>Seus pedidos aparecerão aqui depois de finalizar uma compra.</p>" +
                '<a href="../../index.html" class="continuar">Ver produtos</a>' +
            "</div>";
        return;
    }
    if (aviso) aviso.style.display = "none";

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