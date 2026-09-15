// =============================================
// ARYN - Alternador de tema (claro / escuro)
// =============================================
(function () {
    var chave = 'aryn_tema';
    var tema = localStorage.getItem(chave) || 'escuro';
    if (tema !== 'claro' && tema !== 'escuro') tema = 'escuro';

    // Aplica antes do render para evitar "flash"
    document.documentElement.setAttribute('data-tema', tema);

    function icone() {
        return tema === 'escuro'
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
    }

    function criarBotao() {
        var botao = document.createElement('button');
        botao.type = 'button';
        botao.id = 'btn-tema';
        botao.title = tema === 'escuro' ? 'Mudar para tema claro' : 'Mudar para tema escuro';
        botao.setAttribute('aria-label', botao.title);
        botao.innerHTML = icone();

        botao.addEventListener('click', function () {
            tema = tema === 'escuro' ? 'claro' : 'escuro';
            document.documentElement.setAttribute('data-tema', tema);
            localStorage.setItem(chave, tema);
            botao.title = tema === 'escuro' ? 'Mudar para tema claro' : 'Mudar para tema escuro';
            botao.innerHTML = icone();
        });

        document.body.appendChild(botao);
    }

    if (document.body) {
        criarBotao();
    } else {
        window.addEventListener('DOMContentLoaded', criarBotao);
    }
})();