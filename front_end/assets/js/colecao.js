(() => {
    const slug = new URLSearchParams(window.location.search).get('id') || 'formal-essentials';
    const title = document.getElementById('collectionTitle');
    const breadcrumb = document.getElementById('collectionBreadcrumb');
    const heroTitle = document.getElementById('collectionTitleHero');
    const description = document.getElementById('collectionDescription');
    const concept = document.getElementById('collectionConcept');
    const productGrid = document.getElementById('collectionProducts');
    const cartCount = document.getElementById('cartCount');
    const images = ['yt_fp.jpg', 'fb_fp.jpg', 'cs_fp.jpg', 'sp_fp.jpg', 'as_fp.jpg'];
    const money = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const clean = value => String(value || '').replace(/[<>]/g, '');
    const fallbackImage = id => `front_end/assets/produtos/${images[Number(id || 0) % images.length]}`;

    function render(products) {
        if (!products.length) { productGrid.innerHTML = '<div class="state">Esta coleção ainda não possui produtos disponíveis.<br><a class="button button-primary" href="colecoes.html">Ver outras coleções</a></div>'; return; }
        productGrid.innerHTML = products.map(product => { const stock = Number(product.estoque || 0); const name = clean(product.nome || 'Produto ARYN'); return `<article class="product-card" data-product-id="${product.id_produto}"><div class="product-image"><img src="${product.imagem || fallbackImage(product.id_produto)}" alt="${name}" loading="lazy"><button class="favorite" data-action="favorite" type="button" aria-label="Favoritar ${name}">♡</button></div><div class="product-info"><p class="product-category">${clean(product.categoria_nome || 'ARYN')}</p><h3 class="product-name">${name}</h3><p class="product-price">${money(product.preco)}</p><p class="product-stock">${stock > 0 ? `${stock} em estoque` : 'ESGOTADO'}</p><button class="add-cart" data-action="cart" type="button" ${stock <= 0 ? 'disabled' : ''}>${stock > 0 ? 'Adicionar ao carrinho' : 'Indisponível'}</button></div></article>`; }).join('');
    }

    async function load() {
        try {
            const [collectionResponse, productsResponse] = await Promise.all([window.requestApi(`/colecoes/${encodeURIComponent(slug)}`), window.requestApi(`/colecoes/${encodeURIComponent(slug)}/produtos?limite=100`)]);
            const collection = collectionResponse.data;
            title.textContent = collection.nome;
            breadcrumb.textContent = collection.nome;
            heroTitle.textContent = collection.nome;
            description.textContent = collection.descricao;
            concept.textContent = collection.conceito || collection.descricao;
            document.title = `${collection.nome} | Coleções ARYN`;
            render(productsResponse.data || []);
        } catch {
            productGrid.innerHTML = '<div class="state error">Não foi possível carregar esta coleção.<br><button class="retry" id="retryCollection" type="button">Tentar novamente</button></div>';
            document.getElementById('retryCollection')?.addEventListener('click', load);
        }
    }

    function updateAccount() { try { const auth = JSON.parse(localStorage.getItem('aryn_auth') || 'null'); const items = JSON.parse(localStorage.getItem(auth?.usuario ? `aryn_carrinho_db_${auth.usuario}` : 'aryn_carrinho_guest') || '[]'); cartCount.textContent = items.reduce((total, item) => total + Number(item.qtd || item.quantidade || 0), 0); } catch { cartCount.textContent = '0'; } }

    document.getElementById('menuToggle').addEventListener('click', event => { const nav = document.getElementById('siteNav'); const open = nav.classList.toggle('is-open'); event.currentTarget.setAttribute('aria-expanded', String(open)); });
    document.addEventListener('click', async event => { const button = event.target.closest('[data-action]'); const card = event.target.closest('[data-product-id]'); if (!button || !card) return; const auth = JSON.parse(localStorage.getItem('aryn_auth') || 'null'); if (!auth?.token) { window.location.href = 'front_end/modelos/login.html'; return; } try { if (button.dataset.action === 'cart') { await window.requestApi('/carrinho/itens', { method: 'POST', body: { id_produto: Number(card.dataset.productId), quantidade: 1 } }); button.textContent = 'Adicionado'; updateAccount(); } else { await window.requestApi('/favoritos', { method: 'POST', body: { produto_id: Number(card.dataset.productId) } }); button.textContent = '♥'; button.classList.add('is-favorite'); } } catch { button.textContent = 'Tente novamente'; } });
    document.getElementById('newsletterForm').addEventListener('submit', event => { event.preventDefault(); document.getElementById('newsletterMessage').textContent = 'Cadastro preparado para integração com a API.'; });
    load(); updateAccount();
})();
