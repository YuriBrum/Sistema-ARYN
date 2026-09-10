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

/* Funções do Carrinho */
const IMG_PADRAO = "../assets/images/mockup.png";

    function formatarPreco(valor) {
        valor = parseFloat(valor) || 0;
        return "R$ " + valor.toFixed(2).replace(".", ",");
    }

    // Normaliza itens vindos do localStorage (podem ter preco/qtd como texto)
    function limparItem(p) {
        p.preco = parseFloat(p.preco) || 0;
        p.qtd = parseInt(p.qtd, 10) || 1;
        if (p.qtd < 1) p.qtd = 1;
        if (!p.nome) p.nome = "Produto ARYN";
        if (!p.img) p.img = IMG_PADRAO;
        return p;
    }

    // Renderiza os itens do carrinho na tela
    function renderizarCarrinho() {
        try {
            let lista = carregarCarrinho();
            lista = (lista && lista.length ? lista : []).map(limparItem);
            const container = document.getElementById("itens-lista");
            const resumo = document.querySelector(".resumo");

            if (!container) return;

            if (!lista.length) {
                container.innerHTML =
                    '<div class="vazio">' +
                        '<i class="fa-solid fa-cart-shopping"></i>' +
                        "<h3>Seu carrinho está vazio</h3>" +
                        "<p>Adicione um produto para começar a comprar.</p>" +
                        '<a href="../../index.html" class="continuar" style="margin-top:15px;">Ver produtos</a>' +
                    "</div>";
                if (resumo) resumo.style.display = "none";
                atualizarResumo(lista);
                return;
            }

            container.innerHTML = lista.map(p => {
                const img = p.img || IMG_PADRAO;
                const detalhes = [];
                if (p.cor) detalhes.push(p.cor);
                if (p.tamanho) detalhes.push(p.tamanho);
                const detalheStr = detalhes.length ? ' <span style="color:#888">(' + detalhes.join(' / ') + ')</span>' : '';
                return (
                    '<div class="item" data-id="' + p.id + '">' +
                        "<img src=\"" + img + "\" alt=\"" + p.nome + "\">" +
                        "<div>" +
                            "<span>PRODUTO</span>" +
                            "<h3>" + p.nome + detalheStr + "</h3>" +
                            "<p>" + formatarPreco(p.preco) + " cada</p>" +
                            '<div class="quantidade">' +
                                '<button class="qtd-menos" data-id="' + p.id + '">−</button>' +
                                '<span class="qtd-valor">' + p.qtd + "</span>" +
                                '<button class="qtd-mais" data-id="' + p.id + '">+</button>' +
                            "</div>" +
                            '<button class="remover" data-id="' + p.id + '">' +
                                '<i class="fa-solid fa-trash"></i> Remover' +
                            "</button>" +
                        "</div>" +
                        '<div class="lado-direito">' +
                            '<span class="preco">' + formatarPreco(p.preco * p.qtd) + "</span>" +
                        "</div>" +
                    "</div>"
                );
            }).join("");

            if (resumo) resumo.style.display = "";
            atualizarResumo(lista);
        } catch (erro) {
            console.error("Erro ao renderizar carrinho:", erro);
            const container = document.getElementById("itens-lista");
            if (container) {
                container.innerHTML =
                    '<div class="vazio">' +
                        "<h3>Ocorreu um erro ao carregar o carrinho</h3>" +
                    "</div>";
            }
        }
    }

    // Recalcula subtotal e total
    function atualizarResumo(lista) {
        let subtotal = 0;
        lista.forEach(p => { subtotal += (parseFloat(p.preco) || 0) * (parseInt(p.qtd, 10) || 1); });

        const valor = formatarPreco(subtotal);
        const s = document.getElementById("subtotal"); if (s) s.textContent = valor;
        const t = document.getElementById("totalFinalizar"); if (t) t.textContent = valor;
    }

    // Fica ouvindo os botões de quantidade e remover dos itens renderizados
    window.addEventListener("DOMContentLoaded", () => {
        const listaContainer = document.getElementById("itens-lista");
        if (!listaContainer) return;

        listaContainer.addEventListener("click", async (e) => {
            const botao = e.target.closest("button");
            if (!botao) return;

            const id = botao.dataset.id;
            if (!id) return;

            let carrinho = carregarCarrinho();
            const item = carrinho.find(p => String(p.id) === String(id));
            if (!item) return;

            if (botao.classList.contains("qtd-mais")) {
                item.qtd += 1;
            } else if (botao.classList.contains("qtd-menos")) {
                item.qtd -= 1;
                if (item.qtd < 1) item.qtd = 1;
            } else if (botao.classList.contains("remover")) {
                carrinho = carrinho.filter(p => String(p.id) !== String(id));
            }

            await salvarCarrinho(carrinho);
            renderizarCarrinho();
        });
    });

    function calcularTotal() {
        let total = 0;
        carregarCarrinho().forEach(p => {
            total += (parseFloat(p.preco) || 0) * (parseInt(p.qtd, 10) || 1);
        });
        return total;
    }

    function gerarChavePix() {
        const hexChars = '0123456789ABCDEF';
        const bytes = [];
        if (window.crypto && crypto.getRandomValues) {
            const arr = new Uint8Array(32);
            crypto.getRandomValues(arr);
            arr.forEach(b => bytes.push(hexChars[b % 16]));
        } else {
            for (let i = 0; i < 32; i++) bytes.push(hexChars[Math.floor(Math.random() * 16)]);
        }
        return bytes.join('').match(/.{1,4}/g).join('-');
    }

    function copiarChavePix() {
        const chave = document.getElementById("chavePix").textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(chave).then(() => {
                alert("Chave PIX copiada: " + chave);
            });
        } else {
            alert("Chave PIX: " + chave);
        }
    }

    function alternarPagamento() {
        const pix = document.querySelector('input[name="pagamento"][value="PIX"]').checked;
        document.getElementById("areaPix").style.display = pix ? "" : "none";
        document.getElementById("areaCartao").style.display = pix ? "none" : "";
    }

    function formatarNumeroCartao(el) {
        el.value = el.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    function formatarValidade(el) {
        el.value = el.value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(?=\d)/, '$1/');
    }

    function finalizarCompra() {
        const lista = carregarCarrinho();
        if (!lista || !lista.length) {
            alert("Seu carrinho está vazio.");
            return;
        }
        const totalEl = document.getElementById("modalTotal");
        if (totalEl) totalEl.textContent = formatarPreco(calcularTotal());

        document.getElementById("chavePix").textContent = gerarChavePix();
        document.querySelector('input[name="pagamento"][value="PIX"]').checked = true;
        alternarPagamento();
        ["checkNumero", "checkNomeCartao", "checkValidade", "checkCvv"].forEach(id => {
            document.getElementById(id).value = "";
        });

        const modal = document.getElementById("modalFinalizar");
        if (modal) modal.style.display = "flex";
    }

    window.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll('input[name="pagamento"]').forEach(radio => {
            radio.addEventListener("change", alternarPagamento);
        });

        const n = document.getElementById("checkNumero");
        const v = document.getElementById("checkValidade");
        const c = document.getElementById("checkCvv");

        if (n) n.addEventListener("input", e => formatarNumeroCartao(e.target));
        if (v) v.addEventListener("input", e => formatarValidade(e.target));
        if (c) c.addEventListener("input", e => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });
    });

    function fecharModal() {
        const modal = document.getElementById("modalFinalizar");
        if (modal) modal.style.display = "none";
    }

    function confirmarCompra(event) {
        event.preventDefault();

        const endereco = document.getElementById("checkEndereco").value.trim();
        const complemento = document.getElementById("checkComplemento").value.trim();
        const cep = document.getElementById("checkCep").value.trim();
        const pagamento = document.querySelector('input[name="pagamento"]:checked').value;
        const total = formatarPreco(calcularTotal());

        if (!endereco || !cep) {
            alert("Preencha endereço e CEP.");
            return;
        }

        let detalhePagamento = pagamento;
        if (pagamento === "PIX") {
            detalhePagamento = "PIX (chave: " + document.getElementById("chavePix").textContent + ")";
        } else {
            const numero = document.getElementById("checkNumero").value.replace(/\D/g, "");
            const nomeCartao = document.getElementById("checkNomeCartao").value.trim();
            const validade = document.getElementById("checkValidade").value.trim();
            const cvv = document.getElementById("checkCvv").value.trim();
            if (numero.length < 12 || !nomeCartao || !validade || !cvv) {
                alert("Preencha os dados do cartão corretamente.");
                return;
            }
            detalhePagamento = "Cartão **** " + numero.slice(-4) + " (" + nomeCartao + ")";
        }

        const itensComprados = carregarCarrinho();
        let semEstoque = [];

        if (typeof reduzirEstoque === 'function') {
            itensComprados.forEach(item => {
                const estoqueAtual = obterEstoque(item.nome);
                const qtdComprar = item.qtd || 1;
                if (estoqueAtual <= 0) {
                    semEstoque.push(item.nome + ' (já esgotado)');
                } else if (qtdComprar > estoqueAtual) {
                    semEstoque.push(item.nome + ' (disponível: ' + estoqueAtual + ')');
                }
                reduzirEstoque(item.nome, qtdComprar);
            });
        }

        if (typeof isLoggedIn === 'function' && isLoggedIn()) {
            const usuario = getUsuarioLogado();
            const pedidosKey = 'aryn_pedidos_' + usuario;
            let pedidos = [];
            try { pedidos = JSON.parse(localStorage.getItem(pedidosKey) || '[]'); } catch (e) { pedidos = []; }

            const agora = new Date();
            const dataFormatada = agora.toLocaleDateString('pt-BR') + ' ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            pedidos.push({
                id: Date.now(),
                data: dataFormatada,
                itens: itensComprados.map(item => ({
                    nome: item.nome,
                    preco: parseFloat(item.preco) || 0,
                    qtd: parseInt(item.qtd, 10) || 1,
                    img: item.img || ''
                })),
                total: calcularTotal(),
                pagamento: detalhePagamento,
                endereco: endereco + (complemento ? ' - ' + complemento : '') + ' | CEP: ' + cep
            });

            localStorage.setItem(pedidosKey, JSON.stringify(pedidos));
        }

        salvarCarrinho([]).then(() => {
            fecharModal();
            renderizarCarrinho();

            let msg = "Pedido confirmado!\n\n" +
                "Entrega: " + endereco +
                (complemento ? " - " + complemento : "") +
                "\nCEP: " + cep +
                "\nPagamento: " + detalhePagamento +
                "\nTotal: " + total;

            if (semEstoque.length) {
                msg += "\n\nAviso de estoque:\n" + semEstoque.join('\n');
            }

            alert(msg);
        });
    }

    window.addEventListener("DOMContentLoaded", renderizarCarrinho);