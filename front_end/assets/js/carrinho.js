/**
 * ARYN - Carrinho
 * Deslogado: salvo em localStorage (aryn_carrinho_guest)
 * Logado: itens sincronizados com o banco pela API e mantidos em cache local.
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

// ---- Sincronização com a API ----
async function salvarCarrinhoDB(usuario, carrinho) {
    localStorage.setItem(getCartDbKey(usuario), JSON.stringify(carrinho));
    return true;
}

async function carregarCarrinhoDB(usuario) {
    const raw = localStorage.getItem(getCartDbKey(usuario));
    try { return raw ? JSON.parse(raw) : []; } catch { return []; }
}

// ---- API pública do carrinho ----
function carregarCarrinho() {
    if (typeof isLoggedIn === 'function' && isLoggedIn()) {
        // Usa o cache local enquanto a tela aguarda a sincronização com a API.
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
    // Exige conta logada para poder adicionar ao carrinho
    if (!exigirLoginParaAcao('Para adicionar ao carrinho é preciso ter uma conta ARYN salva e logada.')) {
        return null;
    }

    // produto: {id, nome, preco, qtd, img}
    const auth = typeof getAuth === 'function' ? getAuth() : null;
    if (auth && auth.id_cliente && typeof apiRequest === 'function') {
        try {
            await apiRequest('/carrinho/itens', {
                method: 'POST',
                body: {
                    id_produto: produto.id_produto || produto.id,
                    quantidade: produto.qtd || 1
                }
            });
        } catch (error) {
            console.error('Não foi possível sincronizar o carrinho:', error);
        }
    }

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

async function carregarCarrinhoDaApi() {
    const auth = typeof getAuth === 'function' ? getAuth() : null;
    if (!auth || !auth.id_cliente || typeof apiRequest !== 'function') return;

    try {
        const resposta = await apiRequest('/carrinho');
        const itens = (resposta.data?.itens || resposta.data || []).map(item => ({
            id: item.id_produto,
            id_item: item.id_item,
            nome: item.nome_produto || item.produto_nome || 'Produto ARYN',
            preco: Number(item.preco_unitario),
            qtd: Number(item.quantidade),
            img: item.imagem
        }));
        localStorage.setItem(getCartKey(), JSON.stringify(itens));
        if (typeof renderizarCarrinho === 'function') renderizarCarrinho();
    } catch (error) {
        console.error('Não foi possível carregar o carrinho da API:', error);
    }
}

async function removerDoCarrinho(id) {
    let carrinho = carregarCarrinho();
    const item = carrinho.find(p => String(p.id_item) === String(id) || String(p.id) === String(id));
    if (isLoggedIn() && item?.id_item && typeof apiRequest === 'function') {
        await apiRequest(`/carrinho/itens/${item.id_item}`, { method: 'DELETE' });
    }
    carrinho = carrinho.filter(p => String(p.id) !== String(id));
    await salvarCarrinho(carrinho);
    return carrinho;
}

async function atualizarQuantidade(id, novaQtd) {
    const carrinho = carregarCarrinho();
    const item = carrinho.find(p => String(p.id) === String(id));
    if (item) {
        item.qtd = Math.max(1, novaQtd);
        if (isLoggedIn() && item.id_item && typeof apiRequest === 'function') {
            await apiRequest(`/carrinho/itens/${item.id_item}`, {
                method: 'PATCH',
                body: { quantidade: item.qtd }
            });
        }
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
    if (typeof isLoggedIn === 'function' && isLoggedIn()) return 'BANCO via API (cache local)';
    return 'localStorage (' + CART_GUEST_KEY + ')';
}

/* Funções do Carrinho */
const IMG_PADRAO_CARRINHO = "../assets/images/as_cb.jpg";

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
        if (!p.img) p.img = IMG_PADRAO_CARRINHO;
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
                const img = p.img || IMG_PADRAO_CARRINHO;
                const detalhes = [];
                if (p.cor) detalhes.push(p.cor);
                if (p.tamanho) detalhes.push(p.tamanho);
                const detalheStr = detalhes.length ? ' <span style="color:#888">(' + detalhes.join(' / ') + ')</span>' : '';
                return (
                    '<div class="item" data-id="' + p.id + '">' +
                        '<img src="' + img + '" alt="' + p.nome + '" onerror="this.onerror=null;this.src=\'../assets/images/as_cb.jpg\';">' +
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
        carregarCarrinhoDaApi();
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

    function getUsuarioAtual() {
        return (typeof isLoggedIn === 'function' && isLoggedIn())
            ? getUsuarioLogado()
            : 'anon';
    }

    function getEnderecosKey() {
        return 'aryn_enderecos_' + getUsuarioAtual();
    }

    function carregarEnderecos() {
        try {
            const lista = JSON.parse(localStorage.getItem(getEnderecosKey()) || '[]');
            return Array.isArray(lista) ? lista : [];
        } catch (e) {
            return [];
        }
    }

    function migrarEnderecosAntigos() {
        const lista = carregarEnderecos();
        if (lista.length) return lista;
        const chaveAntiga = 'aryn_endereco_entrega_' + getUsuarioAtual();
        try {
            const antigo = JSON.parse(localStorage.getItem(chaveAntiga) || '{}');
            if (antigo && (antigo.checkEndereco || antigo.checkCep)) {
                lista.push({
                    endereco: antigo.checkEndereco || '',
                    complemento: antigo.checkComplemento || '',
                    cep: antigo.checkCep || ''
                });
                localStorage.setItem(getEnderecosKey(), JSON.stringify(lista));
            }
        } catch (e) { }
        return lista;
    }

    function salvarEnderecoUtilizado(endereco, complemento, cep) {
        const lista = carregarEnderecos();
        const novo = { endereco: endereco, complemento: complemento, cep: cep };
        const jaExiste = lista.some(a =>
            a.endereco === novo.endereco &&
            (a.complemento || '') === (novo.complemento || '') &&
            a.cep === novo.cep
        );
        if (!jaExiste) {
            lista.push(novo);
            localStorage.setItem(getEnderecosKey(), JSON.stringify(lista));
        }
    }

    function renderizarListaEnderecos() {
        const box = document.getElementById("listaEnderecos");
        if (!box) return;
        const lista = migrarEnderecosAntigos();
        if (!lista.length) {
            box.innerHTML = '<p class="sem-enderecos">Nenhum endereço salvo ainda.</p>';
            return;
        }
        box.innerHTML = lista.map((a, i) =>
            '<div class="item-endereco">' +
            '<button type="button" class="escolher" onclick="escolherEndereco(' + i + ')">' +
            '<strong>' + a.endereco + '</strong>' +
            '<span>' + (a.complemento ? a.complemento + ' &middot; ' : '') + 'CEP: ' + a.cep + '</span>' +
            '</button>' +
            '<button type="button" class="remover-endereco" onclick="excluirEndereco(' + i + ')" title="Excluir endereço" aria-label="Excluir endereço">' +
            '<i class="fa-solid fa-trash-can"></i>' +
            '</button>' +
            '</div>'
        ).join('');
    }

    function alternarListaEnderecos() {
        const box = document.getElementById("listaEnderecos");
        if (!box) return;
        const visivel = box.style.display === "block";
        if (visivel) {
            box.style.display = "none";
        } else {
            renderizarListaEnderecos();
            box.style.display = "block";
        }
    }

    function escolherEndereco(idx) {
        const lista = carregarEnderecos();
        const a = lista[idx];
        if (!a) return;
        if (a.endereco) document.getElementById("checkEndereco").value = a.endereco;
        if (a.complemento) document.getElementById("checkComplemento").value = a.complemento;
        if (a.cep) document.getElementById("checkCep").value = a.cep;
        const box = document.getElementById("listaEnderecos");
        if (box) box.style.display = "none";
    }

    function excluirEndereco(idx) {
        const lista = carregarEnderecos();
        if (idx < 0 || idx >= lista.length) return;
        lista.splice(idx, 1);
        localStorage.setItem(getEnderecosKey(), JSON.stringify(lista));
        renderizarListaEnderecos();
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
        ["checkEndereco", "checkComplemento", "checkCep", "checkNumero", "checkNomeCartao", "checkValidade", "checkCvv"].forEach(id => {
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

        salvarEnderecoUtilizado(endereco, complemento, cep);

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

        const pedidosKey = (typeof isLoggedIn === 'function' && isLoggedIn())
            ? 'aryn_pedidos_' + getUsuarioLogado()
            : 'aryn_pedidos_anon';
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