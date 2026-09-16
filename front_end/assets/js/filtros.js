// =============================================
// ARYN - Painel de filtros (tamanho, cor, avaliação, valor)
// =============================================
(function () {
    const painel = document.getElementById('painelFiltros');
    const grade = document.getElementById('listaProdutos');
    if (!painel || !grade) return;

    const cards = Array.prototype.slice.call(grade.querySelectorAll('.card'));
    if (!cards.length) return;

    function lerNome(card) {
        const el = card.querySelector('h3');
        return el ? el.textContent.trim() : '';
    }

    function coresDoCard(card) {
        const nome = lerNome(card);
        const base = (typeof PRODUTO_OPCOES !== 'undefined' && PRODUTO_OPCOES[nome]) || { cores: [], tamanhos: [] };
        const ordem = base.cores || [];

        const coresVistas = new Set();
        card.querySelectorAll('.carrossel .imagem').forEach(img => {
            const fonte = img.src || img.getAttribute('src');
            const c = (typeof corDoSrc === 'function') ? corDoSrc(fonte) : null;
            if (c) coresVistas.add(c);
        });

        const cores = ordem.filter(cor => coresVistas.has(cor));
        return cores.length ? cores : ordem;
    }

    function opcoesDoCard(card) {
        const nome = lerNome(card);
        const base = (typeof PRODUTO_OPCOES !== 'undefined' && PRODUTO_OPCOES[nome]) || { cores: [], tamanhos: [] };
        return { cores: coresDoCard(card), tamanhos: base.tamanhos || [] };
    }

    function precoDoCard(card) {
        const el = card.querySelector('h4') || card.querySelector('.preco');
        if (el && typeof parsePreco === 'function') return parsePreco(el.textContent);
        return 0;
    }

    // Monta as opções usando os dados encontrados nos cards
    const tamanhosUnicos = [];
    const coresUnicas = [];
    cards.forEach(card => {
        const dados = opcoesDoCard(card);
        dados.tamanhos.forEach(t => { if (!tamanhosUnicos.includes(t)) tamanhosUnicos.push(t); });
        dados.cores.forEach(c => { if (!coresUnicas.includes(c)) coresUnicas.push(c); });
    });

    const elTamanhos = document.getElementById('filtroTamanhos');
    const elCores = document.getElementById('filtroCores');
    const elAva = document.getElementById('filtroAvaliacao');
    const elValorMin = document.getElementById('valorMin');
    const elValorMax = document.getElementById('valorMax');
    const btnLimpar = document.getElementById('limparFiltros');

    const selTamanhos = new Set();
    const selCores = new Set();
    let minRating = 0;
    let minValor = null;
    let maxValor = null;
    let pintarEstrelasFiltro = null;

    // Contador de resultados
    let contadorEl = null;
    if (!document.getElementById('contadorFiltros')) {
        contadorEl = document.createElement('p');
        contadorEl.id = 'contadorFiltros';
        contadorEl.className = 'contador-filtros';
        grade.insertBefore(contadorEl, grade.firstChild);
    } else {
        contadorEl = document.getElementById('contadorFiltros');
    }

    function aplicar() {
        let visiveis = 0;
        let total = cards.length;
        cards.forEach(card => {
            const dados = opcoesDoCard(card);
            const preco = precoDoCard(card);
            const nome = lerNome(card);
            const nota = typeof mediaAvaliacao === 'function' ? mediaAvaliacao(nome) : 0;

            let ok = true;
            if (ok && selTamanhos.size && ![...selTamanhos].some(t => dados.tamanhos.includes(t))) ok = false;
            if (ok && selCores.size && ![...selCores].some(c => dados.cores.includes(c))) ok = false;
            if (ok && minRating && nota < minRating) ok = false;
            if (ok && minValor !== null && preco < minValor) ok = false;
            if (ok && maxValor !== null && preco > maxValor) ok = false;

            card.style.display = ok ? '' : 'none';
            if (ok) visiveis++;
        });

        if (visiveis === 0) {
            contadorEl.textContent = 'Nenhum produto encontrado com esses filtros.';
            contadorEl.classList.add('sem-resultados');
        } else {
            contadorEl.textContent = visiveis + (visiveis === 1 ? ' produto encontrado' : ' produtos encontrados') + ' de ' + total;
            contadorEl.classList.remove('sem-resultados');
        }
    }

    // Tamanhos
    if (elTamanhos) {
        tamanhosUnicos.forEach(t => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.value = t;
            label.appendChild(input);
            label.appendChild(document.createTextNode('  ' + t));
            input.addEventListener('change', () => {
                if (input.checked) selTamanhos.add(t); else selTamanhos.delete(t);
                aplicar();
            });
            elTamanhos.appendChild(label);
        });
    }

    // Cores (mostra um quadradinho + nome)
    if (elCores) {
        coresUnicas.forEach(c => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.value = c;
            const hex = (typeof CORES_HEX !== 'undefined' && CORES_HEX[c]) || '#cccccc';
            const bolinha = document.createElement('span');
            bolinha.className = 'bolinha-cor';
            bolinha.style.background = hex;
            label.appendChild(input);
            label.appendChild(bolinha);
            label.appendChild(document.createTextNode(' ' + c));
            input.addEventListener('change', () => {
                if (input.checked) selCores.add(c); else selCores.delete(c);
                aplicar();
            });
            elCores.appendChild(label);
        });
    }

    // Avaliação (Todas / escolha 1 a 5 estrelas)
    if (elAva) {
        const labelTodas = document.createElement('label');
        const inputTodas = document.createElement('input');
        inputTodas.type = 'radio';
        inputTodas.name = 'filtroAva';
        inputTodas.value = '0';
        inputTodas.checked = true;
        labelTodas.appendChild(inputTodas);
        labelTodas.appendChild(document.createTextNode(' Todas as avaliações'));
        elAva.appendChild(labelTodas);

        const estrelasBox = document.createElement('div');
        estrelasBox.className = 'estrelas-filtro';
        const botoesEstrelas = [];
        for (let n = 1; n <= 5; n++) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'estrela-filtro';
            b.dataset.val = String(n);
            b.textContent = '★';
            b.title = n + ' estrela(s) ou mais';
            b.addEventListener('click', () => {
                minRating = n;
                inputTodas.checked = false;
                pintarEstrelas(n);
                aplicar();
            });
            estrelasBox.appendChild(b);
            botoesEstrelas.push(b);
        }
        elAva.appendChild(estrelasBox);

        inputTodas.addEventListener('change', () => {
            minRating = 0;
            pintarEstrelas(0);
            aplicar();
        });

        function pintarEstrelas(n) {
            botoesEstrelas.forEach((b, i) => b.classList.toggle('ativa', i < n));
        }
        pintarEstrelasFiltro = pintarEstrelas;
    }

    // Valor
    if (elValorMin) elValorMin.addEventListener('input', () => {
        minValor = elValorMin.value === '' ? null : Number(elValorMin.value);
        aplicar();
    });
    if (elValorMax) elValorMax.addEventListener('input', () => {
        maxValor = elValorMax.value === '' ? null : Number(elValorMax.value);
        aplicar();
    });

    // Limpar
    if (btnLimpar) btnLimpar.addEventListener('click', () => {
        selTamanhos.clear();
        selCores.clear();
        minRating = 0;
        minValor = null;
        maxValor = null;
        painel.querySelectorAll('input[type="checkbox"]').forEach(i => { i.checked = false; });
        painel.querySelectorAll('input[type="radio"]').forEach(i => { i.checked = (i.value === '0' || !i.value); });
        if (typeof pintarEstrelasFiltro === 'function') pintarEstrelasFiltro(0);
        if (elValorMin) elValorMin.value = '';
        if (elValorMax) elValorMax.value = '';
        aplicar();
    });

    aplicar();
})();