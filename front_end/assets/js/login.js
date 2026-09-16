(() => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('senha');
    const rememberInput = document.getElementById('lembrar');
    const passwordToggle = document.getElementById('passwordToggle');
    const submitButton = document.getElementById('loginSubmit');
    const errorMessage = document.getElementById('loginError');

    if (!form || !emailInput || !passwordInput || !submitButton || typeof requestApi !== 'function') return;

    function setError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.toggle('is-visible', Boolean(message));
    }

    function setLoading(loading) {
        submitButton.disabled = loading;
        submitButton.textContent = loading ? 'ENTRANDO...' : 'ENTRAR';
    }

    function validEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function saveSession(session) {
        const usuario = session.usuario || {};
        localStorage.setItem('aryn_auth', JSON.stringify({
            usuario: usuario.email,
            id_usuario: usuario.id_usuario || null,
            id_cliente: usuario.id_cliente || null,
            tipo: usuario.tipo || 'CLIENTE',
            token: session.token,
            logado: true,
            loginAt: Date.now()
        }));

        if (rememberInput.checked) localStorage.setItem('aryn_usuario', usuario.email);
        else localStorage.removeItem('aryn_usuario');
    }

    passwordToggle?.addEventListener('click', () => {
        const visible = passwordInput.type === 'text';
        passwordInput.type = visible ? 'password' : 'text';
        passwordToggle.setAttribute('aria-label', visible ? 'Mostrar senha' : 'Ocultar senha');
        passwordToggle.textContent = visible ? '◉' : '◌';
    });

    form.addEventListener('submit', async event => {
        event.preventDefault();
        setError('');

        const email = emailInput.value.trim().toLowerCase();
        const senha = passwordInput.value;

        if (!email) {
            setError('Digite seu e-mail.');
            emailInput.focus();
            return;
        }
        if (!validEmail(email)) {
            setError('Digite um e-mail válido.');
            emailInput.focus();
            return;
        }
        if (!senha) {
            setError('Digite sua senha.');
            passwordInput.focus();
            return;
        }

        setLoading(true);
        try {
            const response = await requestApi('/auth/login', {
                method: 'POST',
                body: { email, senha }
            });
            const session = response.data || response;

            if (!session.token || !session.usuario) {
                throw new Error('Resposta de autenticação inválida.');
            }

            saveSession(session);
            window.location.assign('../../index.html');
        } catch (error) {
            if (error.status === 401) setError('E-mail ou senha incorretos.');
            else if (error.status === 403) setError('Você não possui permissão para acessar este recurso.');
            else if (error.status === 404) setError('Usuário não encontrado.');
            else setError(error.message || 'Não foi possível realizar o login. Tente novamente.');
            setLoading(false);
        }
    });

    const rememberedEmail = localStorage.getItem('aryn_usuario');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberInput.checked = true;
    }
})();
