<?php
fetch("../backend/produtos.php")
    .then(resposta => resposta.json())
    .then(dados => {
        console.log(dados);
    });

fetch("../backend/login.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email: email,
        senha: senha
    })
})
.then(resposta => resposta.json())
.then(dados => {
    console.log(dados);
});