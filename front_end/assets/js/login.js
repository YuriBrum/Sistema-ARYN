function validarEmail(valor) {
  valor = valor.trim();
  if (!valor) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

function mostrarErro(msg) {
  const el = document.getElementById("erro");
  el.textContent = msg;
  el.classList.add("visivel");
}

function limparErro() {
  const el = document.getElementById("erro");
  el.textContent = "";
  el.classList.remove("visivel");
}

function fazerLogin(event) {
  event.preventDefault();
  limparErro();

  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value;

  if (!usuario || !senha) {
    mostrarErro("Preencha e-mail e senha.");
    return;
  }

  if (!validarEmail(usuario)) {
    mostrarErro("Digite um e-mail válido (ex: usuario@hotmail.com).");
    return;
  }

  if (senha.length < 4) {
    mostrarErro("A senha deve ter pelo menos 4 caracteres.");
    return;
  }

  // Sistema de sessão ARYN: deslogado usa localStorage, logado bloqueia login/cadastro
  login(usuario.toLowerCase());
  if (document.getElementById("lembrar").checked) {
    localStorage.setItem("aryn_lembrar", "1");
  } else {
    localStorage.removeItem("aryn_lembrar");
  }

  alert(
    "Login realizado com sucesso! Carrinho agora será salvo no BANCO (" +
      ondeCarrinhoEstaSalvo() +
      ")"
  );
  window.location.href = "usuarios.html";
}

function toggleSenha() {
  const input = document.getElementById("senha");
  const icone = document.getElementById("iconeSenha");
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  icone.className = isPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
}

function esqueceuSenha(event) {
  event.preventDefault();
  const usuario = prompt(
    "Digite seu e-mail para recuperar a senha:"
  );
  if (usuario === null) return;
  if (!validarEmail(usuario.trim())) {
    alert("Digite um e-mail válido.");
    return;
  }
  alert("Link de recuperação enviado para: " + usuario.trim());
}

// Pré-preenche se lembrar estava ativo
window.addEventListener("DOMContentLoaded", () => {
  const salvo = localStorage.getItem("aryn_usuario");
  if (salvo && localStorage.getItem("aryn_lembrar") === "1") {
    document.getElementById("usuario").value = salvo;
    document.getElementById("lembrar").checked = true;
  }
});
