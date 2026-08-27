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

    botao.addEventListener("click", () => {

        botao.textContent = "✓ Adicionado"; // isso mostra uma marca de verificação e a palavra "Adicionado" no botão

    });

});