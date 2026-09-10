const IMG_PADRAO = "../assets/images/mockup.png";

function formatarPreco(valor) {
    valor = parseFloat(valor) || 0;
    return "R$ " + valor.toFixed(2).replace(".", ",");
}

function chaveCurtidas() {
    return 'aryn_favoritos_db_' + (typeof getUsuarioLogado === 'function' ? (getUsuarioLogado() || 'anon') : 'anon');
}

function carregarCurtidas() {
    try {
        const raw = localStorage.getItem(chaveCurtidas());
        let lista = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(lista)) return [];
        return lista.map(item => {
            if (typeof item === 'string') {
                const partes = item.split('|');
                return {
                    id: item,
                    nome: partes[0] || 'Produto ARYN',
                    preco: parseFloat(partes[1]) || 0,
                    img: ''
                };
            }
            return item;
        }).filter(p => p);
    } catch (e) {
        return [];
    }
}

function salvarCurtidas(lista) {
    localStorage.setItem(chaveCurtidas(), JSON.stringify(lista));
}

function renderizarCurtidas() {
    const container = document.getElementById("lista-curtidas");
    if (!container) return;

    const aviso = document.getElementById("avisoVisitante");
    const logado = typeof isLoggedIn === 'function' && isLoggedIn();

    const lista = carregarCurtidas();

    if (!lista.length) {
        if (aviso) aviso.style.display = logado ? "none" : "";
        container.innerHTML =
            '<div class="vazio">' +
                '<i class="fa-solid fa-heart"></i>' +
                '<h3>Você não curtiu nenhum produto ainda</h3>' +
                '<p>Toque no coração de um produto para ele aparecer aqui.</p>' +
                '<a href="../../index.html" class="continuar">Ver produtos</a>' +
            "</div>";
        return;
    }

    if (aviso) aviso.style.display = "none";

    container.innerHTML = lista.map(p => {
        const img = p.img || IMG_PADRAO;
        return (
            '<div class="item" data-id="' + p.id + '">' +
                "<img src=\"" + img + "\" alt=\"" + p.nome + "\">" +
                "<div>" +
                    "<h3>" + p.nome + "</h3>" +
                    "<p>" + formatarPreco(p.preco) + "</p>" +
                "</div>" +
                '<div class="acoes">' +
                    '<button class="adicionar-carrinho" data-id="' + p.id + '">' +
                        '<i class="fa-solid fa-cart-shopping"></i> Adicionar ao carrinho' +
                    "</button>" +
                    '<button class="remover-curtida" data-id="' + p.id + '">' +
                        '<i class="fa-solid fa-heart-broken"></i> Remover das curtidas' +
                    "</button>" +
                "</div>" +
            "</div>"
        );
    }).join("");
}

window.addEventListener("DOMContentLoaded", () => {
    renderizarCurtidas();

    const container = document.getElementById("lista-curtidas");
    if (!container) return;

    container.addEventListener("click", async (e) => {
        const botao = e.target.closest("button");
        if (!botao) return;
        const id = botao.dataset.id;
        if (!id) return;

        let lista = carregarCurtidas();

        if (botao.classList.contains("remover-curtida")) {
            salvarCurtidas(lista.filter(p => String(p.id) !== String(id)));
            renderizarCurtidas();
        } else if (botao.classList.contains("adicionar-carrinho")) {
            const item = lista.find(p => String(p.id) === String(id));
            if (item && typeof adicionarAoCarrinho === 'function') {
                await adicionarAoCarrinho({
                    id: item.id,
                    nome: item.nome,
                    preco: item.preco,
                    img: item.img,
                    qtd: 1
                });
                botao.textContent = "✓ Adicionado ao carrinho";
                setTimeout(() => {
                    botao.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Adicionar ao carrinho';
                }, 1800);
            }
        }
    });
});