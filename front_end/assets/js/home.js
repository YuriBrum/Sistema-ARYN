(() => {
    const selectionGrid = document.getElementById('selectionGrid');
    const newGrid = document.getElementById('newGrid');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const menuToggle = document.getElementById('menuToggle');
    const siteNav = document.getElementById('siteNav');
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterMessage = document.getElementById('newsletterMessage');
    const cartCount = document.getElementById('cartCount');
    let products = [];

    const money = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const productImage = product => product.imagem || 'front_end/assets/produtos/yt_fp.jpg';
    const productText = product => `${product.nome || ''} ${product.categoria_nome || ''} ${product.descricao || ''}`.toLowerCase();

    function setState(container, message) {
        if (container) container.innerHTML = `<p class="product-state">${message}</p>`;
    }

    function productCard(product, badge = '') {
        const stock = Number(product.estoque ?? 0);
        const unavailable = stock <= 0;
        const safeName = String(product.nome || 'Produto ARYN').replace(/[<>]/g, '');
        const category = String(product.categoria_nome || 'Seleção ARYN').replace(/[<>]/g, '');
        return `<article class="product-card" data-product-id="${product.id_produto || ''}">
            <div class="product-image">
                <a href="#produto-${product.id_produto || ''}" aria-label="Ver ${safeName}">
                    <img src="${productImage(product)}" alt="${safeName}" loading="lazy">
                </a>
                ${badge ? `<span class="product-badge">${badge}</span>` : ''}
                <button class="favorite-button" type="button" data-action="favorite" aria-label="Favoritar ${safeName}">♡</button>
            </div>
            <div class="product-info">
                <p class="product-category">${category}</p>
                <h3 class="product-name">${safeName}</h3>
                <p class="product-price">${money(product.preco)}</p>
                <p class="product-stock">${unavailable ? 'ESGOTADO' : `${stock} em estoque`}</p>
                <div class="product-actions">
                    <button class="button button-primary" type="button" data-action="cart" ${unavailable ? 'disabled' : ''}>${unavailable ? 'Indisponível' : 'Adicionar'}</button>
                </div>
            </div>
        </article>`;
    }

    function renderProducts(list, container, badge = '') {
        if (!container) return;
        if (!list.length) {
            setState(container, 'Nenhum produto disponível no momento.');
            return;
        }
        container.innerHTML = list.map(product => productCard(product, badge)).join('');
    }

    function filterProducts(query = '') {
        const normalized = query.trim().toLowerCase();
        const filtered = normalized ? products.filter(product => productText(product).includes(normalized)) : products;
        renderProducts(filtered.slice(0, 8), selectionGrid);
        renderProducts(filtered.slice(0, 4), newGrid, 'NOVO');
        if (normalized) document.getElementById('selectionTitle').textContent = `Resultados para: ${query}`;
    }

    async function loadProducts() {
        if (typeof window.requestApi !== 'function') {
            setState(selectionGrid, 'Não foi possível carregar os produtos.');
            setState(newGrid, 'Não foi possível carregar os produtos.');
            return;
        }
        try {
            const response = await window.requestApi('/produtos');
            products = Array.isArray(response.data) ? response.data : [];
            renderProducts(products.slice(0, 8), selectionGrid);
            renderProducts(products.slice(0, 4), newGrid, 'NOVO');
        } catch {
            setState(selectionGrid, 'Não foi possível carregar os produtos.');
            setState(newGrid, 'Não foi possível carregar os produtos.');
        }
    }

    function updateCartCount() {
        try {
            const auth = JSON.parse(localStorage.getItem('aryn_auth') || 'null');
            const key = auth?.usuario ? `aryn_carrinho_db_${auth.usuario}` : 'aryn_carrinho_guest';
            const items = JSON.parse(localStorage.getItem(key) || '[]');
            cartCount.textContent = items.reduce((total, item) => total + Number(item.qtd || item.quantidade || 0), 0);
        } catch {
            cartCount.textContent = '0';
        }
    }

    searchForm?.addEventListener('submit', event => {
        event.preventDefault();
        filterProducts(searchInput.value);
        document.getElementById('selecao')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', () => {
            const category = link.dataset.category || '';
            searchInput.value = category;
            filterProducts(category);
        });
    });

    menuToggle?.addEventListener('click', () => {
        const open = siteNav.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', async event => {
        const action = event.target.closest('[data-action]')?.dataset.action;
        const card = event.target.closest('[data-product-id]');
        if (!action || !card) return;
        const product = products.find(item => String(item.id_produto) === String(card.dataset.productId));
        if (!product) return;

        if (action === 'cart') {
            const auth = JSON.parse(localStorage.getItem('aryn_auth') || 'null');
            if (!auth?.token) {
                window.location.href = 'front_end/modelos/login.html';
                return;
            }
            try {
                await window.requestApi('/carrinho/itens', { method: 'POST', body: { id_produto: product.id_produto, quantidade: 1 } });
                event.target.textContent = 'Adicionado';
                updateCartCount();
            } catch {
                event.target.textContent = 'Tente novamente';
            }
        }

        if (action === 'favorite') {
            const auth = JSON.parse(localStorage.getItem('aryn_auth') || 'null');
            if (!auth?.token) {
                window.location.href = 'front_end/modelos/login.html';
                return;
            }
            try {
                await window.requestApi('/favoritos', { method: 'POST', body: { produto_id: product.id_produto } });
                event.target.classList.add('is-favorite');
                event.target.textContent = '♥';
            } catch {
                event.target.textContent = '♡';
            }
        }
    });

    newsletterForm?.addEventListener('submit', event => {
        event.preventDefault();
        newsletterMessage.textContent = 'Cadastro preparado. A newsletter será conectada à API quando o endpoint estiver disponível.';
    });

    updateCartCount();
    loadProducts();
})();
