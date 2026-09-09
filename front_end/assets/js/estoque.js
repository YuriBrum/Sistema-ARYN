const ESTOQUE_KEY = 'aryn_estoque';

const ESTOQUE_INICIAL = {
    'Camisa Social Polo ARYN': 24,
    'Blazer ARYN': 38,
    'Smoke Terno ARYN': 34,
    'Terno ARYN': 21,
    'Camisa Social Slim ARYN': 17,
    'Camisa Social ARYN': 24,
    'Camisa Social Feminina ARYN': 24,
    'Blazer Feminino ARYN': 38
};

function carregarEstoque() {
    try {
        const raw = localStorage.getItem(ESTOQUE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { ...ESTOQUE_INICIAL };
}

function salvarEstoque(estoque) {
    localStorage.setItem(ESTOQUE_KEY, JSON.stringify(estoque));
}

function obterEstoque(nome) {
    const estoque = carregarEstoque();
    return estoque[nome] !== undefined ? estoque[nome] : 0;
}

function reduzirEstoque(nome, qtd) {
    const estoque = carregarEstoque();
    const atual = estoque[nome] !== undefined ? estoque[nome] : 0;
    estoque[nome] = Math.max(0, atual - qtd);
    salvarEstoque(estoque);
    return estoque[nome];
}

function renderizarEstoque() {
    document.querySelectorAll('.card').forEach(card => {
        const h3 = card.querySelector('h3');
        if (!h3) return;
        const nome = h3.textContent.trim();
        const estoqueEl = card.querySelector('.info p');
        if (!estoqueEl) return;
        const qtd = obterEstoque(nome);
        if (qtd > 0) {
            estoqueEl.textContent = qtd + ' em estoque';
            estoqueEl.style.color = '';
        } else {
            estoqueEl.textContent = 'Estoque esgotado';
            estoqueEl.style.color = '#d00';
        }
    });
}

window.addEventListener('DOMContentLoaded', renderizarEstoque);
