(() => {
    const state = { categories: [], products: [], page: 1, limit: 12 };
    const params = new URLSearchParams(window.location.search);
    const categoryGrid = document.getElementById('allCategories');
    const featuredGrid = document.getElementById('featuredCategories');
    const productGrid = document.getElementById('productGrid');
    const resultCount = document.getElementById('resultCount');
    const searchInput = document.getElementById('productSearch');
    const categorySelect = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortProducts');
    const filterForm = document.getElementById('filterForm');
    const filters = document.getElementById('filters');
    const cartCount = document.getElementById('cartCount');
    const loadMore = document.getElementById('loadMore');

    const images = ['yt_fp.jpg', 'fb_fp.jpg', 'cs_fp.jpg', 'sp_fp.jpg', 'o_mp_completo.jpg', 'as_fp.jpg'];
    const money = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const clean = value => String(value || '').replace(/[<>]/g, '');
    const categoryImage = index => `front_end/assets/produtos/${images[index % images.length]}`;

    function showState(message, error = false) {
        productGrid.innerHTML = `<div class="state${error ? ' error' : ''}">${message}${error ? '<br><button class="retry-button" type="button" id="retryProducts">Tentar novamente</button>' : ''}</div>`;
        document.getElementById('retryProducts')?.addEventListener('click', loadProducts);
    }

    function renderFeatured() {
        if (!state.categories.length) {
            featuredGrid.innerHTML = '<p class="state">Nenhuma categoria encontrada.</p>';
            return;
        }
        featuredGrid.innerHTML = state.categories.slice(0, 6).map((category, index) => `<a class="featured-card" style="background-image:url('${categoryImage(index)}')" href="?categoria=${category.id_categoria}">
            <div><strong>${clean(category.nome)}</strong><small>${Number(category.quantidade_produtos || 0)} produtos · Explorar →</small></div>
        </a>`).join('');
    }

    function renderCategories() {
        categorySelect.innerHTML = '<option value="">Todas as categorias</option>' + state.categories.map(category => `<option value="${category.id_categoria}">${clean(category.nome)} (${Number(category.quantidade_produtos || 0)})</option>`).join('');
        const selected = params.get('categoria') || '';
        categorySelect.value = selected;
        categoryGrid.innerHTML = state.categories.length
            ? state.categories.map(category => `<a href="?categoria=${category.id_categoria}" class="category-row"><span>${clean(category.nome)}</span><small>${Number(category.quantidade_produtos || 0)} produtos</small></a>`).join('')
            : '<p class="state">Nenhuma categoria encontrada.</p>';
    }

    function renderProducts(products, append = false) {
        if (!products.length) {
            showState('Nenhum produto encontrado.<br><small>Tente alterar seus filtros ou realizar uma nova busca.</small>');
            resultCount.textContent = '0 produtos';
            return;
        }
        resultCount.textContent = `${products.length} produto${products.length === 1 ? '' : 's'}`;
        const markup = products.map(product => {
            const stock = Number(product.estoque || 0);
            const name = clean(product.nome || 'Produto ARYN');
            return `<article class="product-card" data-product-id="${product.id_produto}">
                <div class="product-image"><a href="#produto-${product.id_produto}" aria-label="Ver ${name}"><img src="${product.imagem || categoryImage(product.id_produto)}" alt="${name}" loading="lazy"></a><button class="favorite-button" type="button" data-action="favorite" aria-label="Favoritar ${name}">♡</button></div>
                <div class="product-info"><p class="product-category">${clean(product.categoria_nome || 'ARYN')}</p><h3 class="product-name">${name}</h3><p class="product-price">${money(product.preco)}</p><p class="product-stock">${stock > 0 ? `${stock} em estoque` : 'ESGOTADO'}</p><div class="product-actions"><button class="add-cart" type="button" data-action="cart" ${stock <= 0 ? 'disabled' : ''}>${stock > 0 ? 'Adicionar ao carrinho' : 'Indisponível'}</button></div></div>
            </article>`;
        }).join('');
        if (append) productGrid.insertAdjacentHTML('beforeend', markup);
        else productGrid.innerHTML = markup;
    }

    function updateUrl() {
        const query = new URLSearchParams();
        if (categorySelect.value) query.set('categoria', categorySelect.value);
        if (searchInput.value.trim()) query.set('busca', searchInput.value.trim());
        if (document.getElementById('priceMin').value) query.set('precoMin', document.getElementById('priceMin').value);
        if (document.getElementById('priceMax').value) query.set('precoMax', document.getElementById('priceMax').value);
        if (sortSelect.value) query.set('ordem', sortSelect.value);
        history.replaceState(null, '', `${window.location.pathname}?${query.toString()}`);
    }

    function applyUrlState() {
        searchInput.value = params.get('busca') || '';
        document.getElementById('priceMin').value = params.get('precoMin') || '';
        document.getElementById('priceMax').value = params.get('precoMax') || '';
        sortSelect.value = params.get('ordem') || 'recentes';
    }

    async function loadCategories() {
        const response = await window.requestApi('/categorias');
        state.categories = Array.isArray(response.data) ? response.data : [];
        renderFeatured();
        renderCategories();
    }

    async function loadProducts() {
        showState('Carregando produtos...');
        const query = new URLSearchParams({ limite: String(state.limit), pagina: String(state.page) });
        if (categorySelect.value) query.set('categoria', categorySelect.value);
        if (searchInput.value.trim()) query.set('busca', searchInput.value.trim());
        if (document.getElementById('priceMin').value) query.set('precoMin', document.getElementById('priceMin').value);
        if (document.getElementById('priceMax').value) query.set('precoMax', document.getElementById('priceMax').value);
        if (document.getElementById('stockOnly').checked) query.set('estoque', '1');
        query.set('ordenar', sortSelect.value);
        updateUrl();
        try {
            const response = await window.requestApi(`/produtos?${query}`);
            state.products = Array.isArray(response.data) ? response.data : [];
            renderProducts(state.products);
            loadMore.hidden = state.products.length < state.limit;
        } catch {
            showState('Não foi possível carregar os produtos.', true);
        }
    }

    function updateCartCount() {
        try {
            const auth = JSON.parse(localStorage.getItem('aryn_auth') || 'null');
            const items = JSON.parse(localStorage.getItem(auth?.usuario ? `aryn_carrinho_db_${auth.usuario}` : 'aryn_carrinho_guest') || '[]');
            cartCount.textContent = items.reduce((total, item) => total + Number(item.qtd || item.quantidade || 0), 0);
        } catch { cartCount.textContent = '0'; }
    }

    async function updateAccountAndCart() {
        try {
            const auth = JSON.parse(localStorage.getItem('aryn_auth') || 'null');
            const accountLink = document.getElementById('accountLink');
            if (!auth?.token) return;

            accountLink.textContent = auth.tipo === 'ADMIN' ? 'Painel administrativo' : 'Minha conta';
            accountLink.href = auth.tipo === 'ADMIN' ? 'front_end/admin/dashboard.html' : 'front_end/modelos/usuarios.html';

            const response = await window.requestApi('/carrinho');
            const items = response.data?.itens || [];
            cartCount.textContent = items.reduce((total, item) => total + Number(item.quantidade || 0), 0);
        } catch {
            updateCartCount();
        }
    }

    filterForm.addEventListener('submit', event => { event.preventDefault(); state.page = 1; loadProducts(); });
    categorySelect.addEventListener('change', () => { state.page = 1; loadProducts(); });
    sortSelect.addEventListener('change', () => { state.page = 1; loadProducts(); });
    loadMore.addEventListener('click', async () => {
        state.page += 1;
        const query = new URLSearchParams({ limite: String(state.limit), pagina: String(state.page), ordenar: sortSelect.value });
        if (categorySelect.value) query.set('categoria', categorySelect.value);
        if (searchInput.value.trim()) query.set('busca', searchInput.value.trim());
        try {
            const response = await window.requestApi(`/produtos?${query}`);
            const nextProducts = Array.isArray(response.data) ? response.data : [];
            renderProducts(nextProducts, true);
            loadMore.hidden = nextProducts.length < state.limit;
        } catch { loadMore.hidden = true; }
    });
    document.getElementById('clearFilters').addEventListener('click', () => { filterForm.reset(); state.page = 1; loadProducts(); });
    document.getElementById('filterToggle').addEventListener('click', () => filters.classList.toggle('is-open'));
    document.getElementById('menuToggle').addEventListener('click', event => { const nav = document.getElementById('siteNav'); const open = nav.classList.toggle('is-open'); event.currentTarget.setAttribute('aria-expanded', String(open)); });

    document.addEventListener('click', async event => {
        const target = event.target.closest('[data-action]');
        const card = event.target.closest('[data-product-id]');
        if (!target || !card) return;
        const id = card.dataset.productId;
        const auth = JSON.parse(localStorage.getItem('aryn_auth') || 'null');
        if (!auth?.token) { window.location.href = 'front_end/modelos/login.html'; return; }
        try {
            if (target.dataset.action === 'cart') { await window.requestApi('/carrinho/itens', { method: 'POST', body: { id_produto: Number(id), quantidade: 1 } }); target.textContent = 'Adicionado'; updateCartCount(); }
            if (target.dataset.action === 'favorite') { await window.requestApi('/favoritos', { method: 'POST', body: { produto_id: Number(id) } }); target.classList.add('is-favorite'); target.textContent = '♥'; }
        } catch { target.textContent = 'Tente novamente'; }
    });

    document.getElementById('newsletterForm').addEventListener('submit', event => { event.preventDefault(); document.getElementById('newsletterMessage').textContent = 'Cadastro preparado para integração com a API.'; });
    applyUrlState();
    Promise.all([loadCategories(), loadProducts()]).catch(() => { categoryGrid.innerHTML = '<p class="state error">Não foi possível carregar as categorias.</p>'; });
    updateAccountAndCart();
})();
