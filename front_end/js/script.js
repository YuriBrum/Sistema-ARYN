const botoesFavorito = document.querySelectorAll(".favorito");

botoesFavorito.forEach(botao => {

    botao.addEventListener("click", () => {

        let quantidade = parseInt(
            botao.textContent.replace("❤", "").trim() // isso mostra apenas o número de favoritos, removendo o coração e espaços em branco
        );

        quantidade++;

        botao.textContent = `❤ ${quantidade}`;

    });

});

const botoesCarrinho = document.querySelectorAll(".carrinho");

botoesCarrinho.forEach(botao => {

    botao.addEventListener("click", async () => {
        // Tenta usar sistema de carrinho com auth (guest = localStorage, logado = banco)
        const card = botao.closest('.card') || botao.closest('.item');
        let produto = null;
        if (card) {
            const nomeEl = card.querySelector('h3');
            const precoEl = card.querySelector('h4') || card.querySelector('.preco');
            const imgEl = card.querySelector('img');
            const nome = nomeEl ? nomeEl.textContent.trim() : 'Produto ARYN';
            let preco = 99.90;
            if (precoEl) {
                const txt = precoEl.textContent.replace('R$', '').replace(',', '.').trim();
                preco = parseFloat(txt) || preco;
            }
            const id = nome + '|' + preco; // id simples baseado em nome+preço
            produto = { id, nome, preco, qtd: 1, img: imgEl ? imgEl.src : '' };
        } else {
            produto = { id: 'geral-' + Date.now(), nome: 'Produto ARYN', preco: 99.90, qtd: 1 };
        }

        if (typeof adicionarAoCarrinho === 'function') {
            await adicionarAoCarrinho(produto);
            const onde = typeof ondeCarrinhoEstaSalvo === 'function' ? ondeCarrinhoEstaSalvo() : 'localStorage';
            botao.textContent = "✓ Adicionado (" + (onde.includes('BANCO') ? 'banco' : 'visitante') + ")";
        } else {
            // fallback antigo - sem auth.js carregado
            botao.textContent = "✓ Adicionado";
        }
        setTimeout(() => { botao.textContent = "+ Carrinho"; }, 1800);
    });

});
