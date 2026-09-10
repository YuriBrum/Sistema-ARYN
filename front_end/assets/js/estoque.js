const ESTOQUE_KEY = 'aryn_estoque';

const ESTOQUE_INICIAL = {
    'Ternos ARYN': 21,
    'Blazer ARYN': 38,
    'Smoke Terno ARYN': 34,
    'Camiseta Social ARYN': 24,
    'Camisa Social Slim ARYN': 17,
    'Camisa Social Feminina ARYN': 24,
    'Blazer Feminino ARYN': 38
};

function carregarEstoque() {
    try {
        const raw = localStorage.getItem(ESTOQUE_KEY);
        if (raw) {
            const dados = JSON.parse(raw);
            const chavesAntigas = {
                'Terno ARYN': 'Ternos ARYN',
                'Camisa Social Polo ARYN': 'Camiseta Social ARYN'
            };
            let mudou = false;
            Object.entries(chavesAntigas).forEach(([antiga, nova]) => {
                if (dados[antiga] !== undefined && dados[nova] === undefined) {
                    dados[nova] = dados[antiga];
                    delete dados[antiga];
                    mudou = true;
                }
            });
            if (mudou) localStorage.setItem(ESTOQUE_KEY, JSON.stringify(dados));
            return dados;
        }
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
