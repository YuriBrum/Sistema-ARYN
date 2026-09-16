(() => {
    const grid = document.getElementById('collectionGrid');
    const featured = document.getElementById('featuredCollection');
    const cartCount = document.getElementById('cartCount');
    const images = ['yt_fp.jpg', 'fb_fp.jpg', 'cs_fp.jpg', 'sp_fp.jpg', 'as_fp.jpg'];

    function image(index) { return `front_end/assets/produtos/${images[index % images.length]}`; }
    function clean(value) { return String(value || '').replace(/[<>]/g, ''); }

    function card(collection, index) {
        return `<a class="collection-card" style="background-image:url('${image(index)}')" href="colecao.html?id=${encodeURIComponent(collection.slug)}">
            <h3>${clean(collection.nome)}</h3><p>${clean(collection.descricao)}</p><small>${Number(collection.produtos || 0)} produtos · Explorar coleção →</small>
        </a>`;
    }

    async function load() {
        try {
            const response = await window.requestApi('/colecoes');
            const collections = response.data || [];
            if (!collections.length) { grid.innerHTML = '<p class="state">Nenhuma coleção disponível no momento.</p>'; return; }
            grid.innerHTML = collections.map(card).join('');
            const main = collections[0];
            featured.innerHTML = `<div class="feature-image" style="background-image:url('${image(0)}')"></div><div class="feature-copy"><p class="eyebrow">COLEÇÃO EM DESTAQUE</p><h2>${clean(main.nome)}</h2><p>${clean(main.conceito || main.descricao)}</p><a class="button button-primary" href="colecao.html?id=${encodeURIComponent(main.slug)}">Explorar coleção</a></div>`;
        } catch {
            grid.innerHTML = '<p class="state error">Não foi possível carregar as coleções.<br><button class="retry" id="retryCollections" type="button">Tentar novamente</button></p>';
            document.getElementById('retryCollections')?.addEventListener('click', load);
        }
    }

    function updateAccount() {
        try {
            const auth = JSON.parse(localStorage.getItem('aryn_auth') || 'null');
            const link = document.getElementById('accountLink');
            if (auth?.token) { link.textContent = auth.tipo === 'ADMIN' ? 'Painel administrativo' : 'Minha conta'; link.href = auth.tipo === 'ADMIN' ? 'front_end/admin/dashboard.html' : 'front_end/modelos/usuarios.html'; }
            const items = JSON.parse(localStorage.getItem(auth?.usuario ? `aryn_carrinho_db_${auth.usuario}` : 'aryn_carrinho_guest') || '[]');
            cartCount.textContent = items.reduce((total, item) => total + Number(item.qtd || item.quantidade || 0), 0);
        } catch { cartCount.textContent = '0'; }
    }

    document.getElementById('menuToggle').addEventListener('click', event => { const nav = document.getElementById('siteNav'); const open = nav.classList.toggle('is-open'); event.currentTarget.setAttribute('aria-expanded', String(open)); });
    document.getElementById('newsletterForm').addEventListener('submit', event => { event.preventDefault(); document.getElementById('newsletterMessage').textContent = 'Cadastro preparado para integração com a API.'; });
    load(); updateAccount();
})();
