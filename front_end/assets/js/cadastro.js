(() => {
    const form = document.getElementById('cadastroForm');
    const error = document.getElementById('formError');
    const submit = document.getElementById('submitCadastro');
    const password = document.getElementById('senha');
    const confirmation = document.getElementById('confirmarSenha');
    const strengthLabel = document.getElementById('strengthLabel');
    const strengthBars = [...document.querySelectorAll('.strength-track i')];

    if (!form || typeof requestApi !== 'function') return;

    function setError(message) {
        error.textContent = message;
        error.classList.toggle('visible', Boolean(message));
    }

    function setLoading(value) {
        submit.disabled = value;
        submit.textContent = value ? 'CRIANDO CONTA...' : 'CRIAR CONTA';
    }

    function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
    function digits(value) { return value.replace(/\D/g, ''); }
    function maskPhone(value) { const d = digits(value).slice(0, 11); return d.length > 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : d; }
    function maskCpf(value) { const d = digits(value).slice(0, 11); return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'); }

    function updateStrength() {
        const value = password.value;
        let score = 0;
        if (value.length >= 6) score += 1;
        if (value.length >= 8) score += 1;
        if (/[A-Za-z]/.test(value) && /\d/.test(value)) score += 1;
        if (/[^A-Za-z0-9]/.test(value)) score += 1;
        const labels = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];
        strengthLabel.textContent = value ? `Força: ${labels[score]}` : 'Força da senha';
        strengthBars.forEach((bar, index) => bar.classList.toggle('active', index < score));
        document.querySelector('[data-requirement="length"]').classList.toggle('valid', value.length >= 6);
        document.querySelector('[data-requirement="mix"]').classList.toggle('valid', /[A-Za-z]/.test(value) && /\d/.test(value));
    }

    document.getElementById('telefone').addEventListener('input', event => { event.target.value = maskPhone(event.target.value); });
    document.getElementById('cpf').addEventListener('input', event => { event.target.value = maskCpf(event.target.value); });
    password.addEventListener('input', updateStrength);
    document.querySelectorAll('[data-toggle-password]').forEach(button => button.addEventListener('click', () => {
        const input = document.getElementById(button.dataset.togglePassword);
        const visible = input.type === 'text';
        input.type = visible ? 'password' : 'text';
        button.textContent = visible ? '◉' : '◌';
        button.setAttribute('aria-label', visible ? 'Mostrar senha' : 'Ocultar senha');
    }));

    form.addEventListener('submit', async event => {
        event.preventDefault();
        setError('');
        const nome = document.getElementById('nome').value.trim().replace(/\s+/g, ' ');
        const email = document.getElementById('email').value.trim().toLowerCase();
        const senha = password.value;
        const confirmar = confirmation.value;
        const termos = document.getElementById('termos').checked;
        const telefone = digits(document.getElementById('telefone').value);
        const cpf = digits(document.getElementById('cpf').value);

        if (nome.length < 2) return setError('Informe seu nome completo.');
        if (!validEmail(email)) return setError('Digite um e-mail válido.');
        if (senha.length < 6) return setError('Sua senha deve possuir pelo menos 6 caracteres.');
        if (senha !== confirmar) return setError('As senhas não coincidem.');
        if (!termos) return setError('Aceite os Termos de Uso e a Política de Privacidade.');

        setLoading(true);
        try {
            const response = await requestApi('/auth/register', { method: 'POST', body: { nome, email, senha, telefone: telefone || null, cpf: cpf || null, termos: true } });
            const session = response.data || response;
            const usuario = session.usuario;
            localStorage.setItem('aryn_auth', JSON.stringify({ usuario: usuario.email, id_usuario: usuario.id_usuario, id_cliente: usuario.id_cliente, tipo: 'CLIENTE', token: session.token, logado: true, loginAt: Date.now() }));
            localStorage.setItem('aryn_usuario', usuario.email);
            localStorage.setItem(`aryn_dados_${usuario.email}`, JSON.stringify({ nome: usuario.nome, email: usuario.email, telefone, cpf, criadoEm: new Date().toISOString() }));
            window.location.assign('usuarios.html');
        } catch (apiError) {
            setLoading(false);
            if (apiError.status === 409) setError('Este e-mail ou CPF já está cadastrado.');
            else if (apiError.status === 400) setError('Verifique os dados informados.');
            else setError(apiError.message || 'Não foi possível criar sua conta. Tente novamente.');
        }
    });
})();
