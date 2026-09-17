(() => {
    const state = { products: [], page: 1, limit: 12, debounce: null };
    const params = new URLSearchParams(window.location.search);
    const productGrid = document.getElementById('productGrid');
    const featuredGrid = document.getElementById('featuredGrid');
    const resultCount = document.getElementById('resultCount');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('productSearch');
    const sortProducts = document.getElementById('sortProducts');
    const filterForm = document.getElementById('filterForm');
    const filters = document.getElementById('filters');
    const loadMore = document.getElementById('loadMore');
    const cartCount = document.getElementById('cartCount');
    const money = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const clean = value => String(value || '').replace(/[<>]/g, '');
    const image = product => product.imagem || 'front_end/assets/produtos/yt_fp.jpg';

    function showState(message, error = false) {
        productGrid.innerHTML = `<div class="state${error ? ' error' : ''}">${message}${error ? '<br><button class="retry-button" type="button" id="retryProducts">Tentar novamente</button>' : ''}</div>`;
        document.getElementById('retryProducts')?.addEventListener('click', loadProducts);
    }

    function productCard(product) {
        const stock = Number(product.estoque || 0);
        const name = clean(product.nome || 'Produto ARYN');
        const category = clean(product.categoria_nome || product.categoria || 'ARYN');
        const id = Number(product.id_produto);
        const discount = Number(product.desconto_percentual || 0);
        const rating = Number(product.avaliacao_media || 0);
        const ratingMarkup = rating > 0 ? `<p class="offer-rating" aria-label="Avaliação ${rating.toFixed(1)} de 5">${'★'.repeat(Math.round(rating))}${'☆'.repeat(5 - Math.round(rating))}</p>` : '';
        return `<article class="product-card" data-product-id="${id}"><div class="product-image"><a href="front_end/modelos/produto.html?id=${id}" aria-label="Ver ${name}"><img src="${image(product)}" alt="${name}" loading="lazy"></a><span class="discount-badge">-${discount}%</span><button class="favorite-button" type="button" data-action="favorite" aria-label="Favoritar ${name}">♡</button></div><div class="product-info"><p class="product-category">${category}</p><h3 class="product-name">${name}</h3>${ratingMarkup}<p class="offer-price-old">${money(product.preco_original || product.preco)}</p><p class="offer-price">${money(product.preco_promocional)}</p><p class="product-stock">${stock > 0 ? (stock <= 3 ? 'ÚLTIMAS UNIDADES' : `${stock} em estoque`) : 'ESGOTADO'}</p><div class="product-actions"><button class="add-cart" type="button" data-action="cart" ${stock <= 0 ? 'disabled' : ''}>${stock > 0 ? 'Adicionar ao carrinho' : 'Indisponível'}</button></div></div></article>`;
    }

    function renderFeatured() {
        featuredGrid.innerHTML = state.products.length ? state.products.slice(0, 4).map(productCard).join('') : '<p class="state">Nenhuma oferta encontrada.</p>';
    }

    function renderCategories() {
        const groups = new Map();
        state.products.forEach(product => {
            const name = clean(product.categoria_nome || product.categoria || 'ARYN');
            const current = groups.get(name) || { id: product.id_categoria, discount: 0 };
            current.discount = Math.max(current.discount, Number(product.desconto_percentual || 0));
            groups.set(name, current);
        });
        const links = [...groups].map(([name, value]) => `<a href="ofertas.html?categoria=${value.id}">${name}<small>Até ${value.discount}% OFF</small></a>`).join('');
        document.getElementById('categoryLinks').innerHTML = links || '<p class="state">Nenhuma categoria possui ofertas ativas.</p>';
    }

    function renderProducts(products, append = false) {
        if (!products.length && !append) {
            const empty = state.products.length ? 'NENHUMA OFERTA ENCONTRADA<br><small>Não encontramos produtos que correspondam aos filtros selecionados.</small><br><button class="retry-button" type="button" id="clearSearch">Limpar filtros</button>' : 'NENHUMA OFERTA ENCONTRADA<br><small>Não há produtos com preço promocional ativo no momento.</small>';
            showState(empty);
            document.getElementById('clearSearch')?.addEventListener('click', clearFilters);
            resultCount.textContent = '0 produtos';
            return;
        }
        const markup = products.map(productCard).join('');
        if (append) productGrid.insertAdjacentHTML('beforeend', markup); else productGrid.innerHTML = markup;
        resultCount.textContent = `${state.products.length} produto${state.products.length === 1 ? '' : 's'}`;
    }

    function updateUrl() {
        const query = new URLSearchParams();
        if (categoryFilter.value) query.set('categoria', categoryFilter.value);
        if (searchInput.value.trim()) query.set('busca', searchInput.value.trim());
        if (document.getElementById('priceMin').value) query.set('preco_min', document.getElementById('priceMin').value);
        if (document.getElementById('priceMax').value) query.set('preco_max', document.getElementById('priceMax').value);
        if (document.getElementById('discountMin').value) query.set('desconto', document.getElementById('discountMin').value);
        if (document.getElementById('stockOnly').checked) query.set('disponivel', '1');
        if (sortProducts.value !== 'maior-desconto') query.set('ordem', sortProducts.value);
        history.replaceState(null, '', `${window.location.pathname}${query.toString() ? `?${query}` : ''}`);
    }

    function queryParams() {
        const query = new URLSearchParams({ limite: String(state.limit), pagina: String(state.page), ordenar: sortProducts.value });
        if (categoryFilter.value) query.set('categoria', categoryFilter.value);
        if (searchInput.value.trim()) query.set('busca', searchInput.value.trim());
        if (document.getElementById('priceMin').value) query.set('precoMin', document.getElementById('priceMin').value);
        if (document.getElementById('priceMax').value) query.set('precoMax', document.getElementById('priceMax').value);
        if (document.getElementById('discountMin').value) query.set('descontoMin', document.getElementById('discountMin').value);
        if (document.getElementById('stockOnly').checked) query.set('estoque', '1');
        return query;
    }

    async function loadProducts() {
        showState('Carregando ofertas...');
        state.page = 1;
        updateUrl();
        try {
            const response = await window.requestApi(`/produtos/ofertas?${queryParams()}`);
            state.products = Array.isArray(response.data) ? response.data : [];
            renderFeatured();
            renderCategories();
            renderProducts(state.products);
            loadMore.hidden = state.products.length < state.limit;
        } catch {
            featuredGrid.innerHTML = '<p class="state error">Não foi possível carregar as ofertas.</p>';
            showState('NÃO FOI POSSÍVEL CARREGAR AS OFERTAS<br><small>Ocorreu um problema ao carregar os produtos.</small>', true);
        }
    }

    async function loadCategories() {
        try {
            const response = await window.requestApi('/categorias');
            const categories = Array.isArray(response.data) ? response.data : [];
            categoryFilter.innerHTML = '<option value="">Todas as categorias</option>' + categories.map(category => `<option value="${category.id_categoria}">${clean(category.nome)}</option>`).join('');
            categoryFilter.value = params.get('categoria') || '';
        } catch { categoryFilter.innerHTML = '<option value="">Todas as categorias</option>'; }
    }

    function applyUrlState() {
        searchInput.value = params.get('busca') || '';
        document.getElementById('priceMin').value = params.get('preco_min') || '';
        document.getElementById('priceMax').value = params.get('preco_max') || '';
        document.getElementById('discountMin').value = params.get('desconto') || '';
        document.getElementById('stockOnly').checked = params.get('disponivel') === '1';
        sortProducts.value = params.get('ordem') || 'maior-desconto';
        document.getElementById('headerSearch').value = searchInput.value;
    }

    function clearFilters() { filterForm.reset(); state.page = 1; loadProducts(); }

    function updateCartCount() {
        try { const auth = JSON.parse(localStorage.getItem('aryn_auth') || 'null'); const items = JSON.parse(localStorage.getItem(auth?.usuario ? `aryn_carrinho_db_${auth.usuario}` : 'aryn_carrinho_guest') || '[]'); cartCount.textContent = items.reduce((total, item) => total + Number(item.qtd || item.quantidade || 0), 0); } catch { cartCount.textContent = '0'; }
    }

    async function updateAccount() {
        try { const auth = JSON.parse(localStorage.getItem('aryn_auth') || 'null'); const link = document.getElementById('accountLink'); if (auth?.token) { link.textContent = auth.tipo === 'ADMIN' ? 'Painel administrativo' : 'Minha conta'; link.href = auth.tipo === 'ADMIN' ? 'front_end/admin/dashboard.html' : 'front_end/modelos/conta.html'; const response = await window.requestApi('/carrinho'); cartCount.textContent = response.data?.itens?.reduce((total, item) => total + Number(item.quantidade || 0), 0) || 0; } else updateCartCount(); } catch { updateCartCount(); }
    }

    filterForm.addEventListener('submit', event => { event.preventDefault(); loadProducts(); });
    categoryFilter.addEventListener('change', loadProducts);
    sortProducts.addEventListener('change', loadProducts);
    ['priceMin', 'priceMax', 'discountMin', 'stockOnly'].forEach(id => document.getElementById(id).addEventListener('change', loadProducts));
    searchInput.addEventListener('input', () => { clearTimeout(state.debounce); state.debounce = setTimeout(loadProducts, 350); });
    document.getElementById('headerSearch').addEventListener('input', event => { searchInput.value = event.target.value; clearTimeout(state.debounce); state.debounce = setTimeout(loadProducts, 350); });
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    document.getElementById('filterToggle').addEventListener('click', event => { const open = filters.classList.toggle('is-open'); event.currentTarget.setAttribute('aria-expanded', String(open)); });
    document.getElementById('menuToggle').addEventListener('click', event => { const nav = document.getElementById('siteNav'); const open = nav.classList.toggle('is-open'); event.currentTarget.setAttribute('aria-expanded', String(open)); });
    document.getElementById('newsletterForm').addEventListener('submit', event => { event.preventDefault(); document.getElementById('newsletterMessage').textContent = 'Cadastro preparado para integração com a API.'; });
    document.querySelector('.search-form').addEventListener('submit', event => { event.preventDefault(); searchInput.value = document.getElementById('headerSearch').value; loadProducts(); document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' }); });
    loadMore.addEventListener('click', async () => { state.page += 1; try { const response = await window.requestApi(`/produtos/ofertas?${queryParams()}`); const next = Array.isArray(response.data) ? response.data : []; state.products = state.products.concat(next); renderProducts(next, true); loadMore.hidden = next.length < state.limit; } catch { loadMore.hidden = true; } });

    document.addEventListener('click', async event => {
        const target = event.target.closest('[data-action]');
        const card = event.target.closest('[data-product-id]');
        if (!target || !card) return;
        const auth = JSON.parse(localStorage.getItem('aryn_auth') || 'null');
        if (!auth?.token) { window.location.href = 'front_end/modelos/login.html'; return; }
        try {
            if (target.dataset.action === 'cart') { await window.requestApi('/carrinho/itens', { method: 'POST', body: { id_produto: Number(card.dataset.productId), quantidade: 1 } }); target.textContent = 'Adicionado'; updateAccount(); }
            if (target.dataset.action === 'favorite') { await window.requestApi('/favoritos', { method: 'POST', body: { produto_id: Number(card.dataset.productId) } }); target.classList.add('is-favorite'); target.textContent = '♥'; }
        } catch { target.textContent = 'Tente novamente'; }
    });

    applyUrlState();
    loadCategories().then(loadProducts);
    updateAccount();
})();
