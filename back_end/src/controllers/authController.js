const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authModel =
    require('../models/authModel');

async function cadastro(req, res) {
    try {
        const {
            nome,
            email,
            senha
        } = req.body;

        if (!nome || nome.trim() === '') {
            return res.status(400).json({
                success: false,
                message:
                    'O nome é obrigatório.'
            });
        }

        if (!email || email.trim() === '') {
            return res.status(400).json({
                success: false,
                message:
                    'O e-mail é obrigatório.'
            });
        }

        if (!senha || senha.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    'A senha deve possuir pelo menos 6 caracteres.'
            });
        }

        const emailNormalizado =
            email.trim().toLowerCase();

        const usuarioExistente =
            await authModel.buscarUsuarioPorEmail(
                emailNormalizado
            );

        if (usuarioExistente) {
            return res.status(409).json({
                success: false,
                message:
                    'Já existe um usuário cadastrado com este e-mail.'
            });
        }

        const senhaHash =
            await bcrypt.hash(senha, 10);

        const cadastro =
            await authModel.cadastrarCliente(
                nome.trim(),
                emailNormalizado,
                senhaHash
            );

        return res.status(201).json({
            success: true,
            message:
                'Cliente cadastrado com sucesso.',
            data: {
                id_usuario:
                    cadastro.id_usuario,
                id_cliente:
                    cadastro.id_cliente,
                nome: nome.trim(),
                email: emailNormalizado,
                tipo: 'CLIENTE'
            }
        });

    } catch (error) {
        console.error(
            'Erro ao cadastrar cliente:',
            error
        );

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message:
                    'Já existe um usuário cadastrado com este e-mail.'
            });
        }

        return res.status(500).json({
            success: false,
            message:
                'Erro interno ao cadastrar cliente.'
        });
    }
}

async function login(req, res) {
    try {
        const {
            email,
            senha
        } = req.body;

        if (!email || email.trim() === '') {
            return res.status(400).json({
                success: false,
                message:
                    'O e-mail é obrigatório.'
            });
        }

        if (!senha) {
            return res.status(400).json({
                success: false,
                message:
                    'A senha é obrigatória.'
            });
        }

        const emailNormalizado =
            email.trim().toLowerCase();

        const usuario =
            await authModel.buscarUsuarioPorEmail(
                emailNormalizado
            );

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message:
                    'E-mail ou senha inválidos.'
            });
        }

        if (!usuario.status) {
            return res.status(403).json({
                success: false,
                message:
                    'Este usuário está inativo.'
            });
        }

        const senhaValida =
            await bcrypt.compare(
                senha,
                usuario.senha
            );

        if (!senhaValida) {
            return res.status(401).json({
                success: false,
                message:
                    'E-mail ou senha inválidos.'
            });
        }

        const token =
            jwt.sign(
                {
                    id_usuario:
                        usuario.id_usuario,
                    tipo:
                        usuario.tipo
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:
                        process.env.JWT_EXPIRES_IN ||
                        '8h'
                }
            );

        return res.status(200).json({
            success: true,
            message:
                'Login realizado com sucesso.',
            data: {
                token,
                usuario: {
                    id_usuario:
                        usuario.id_usuario,
                    nome:
                        usuario.nome,
                    email:
                        usuario.email,
                    tipo:
                        usuario.tipo
                }
            }
        });

    } catch (error) {
        console.error(
            'Erro ao realizar login:',
            error
        );

        return res.status(500).json({
            success: false,
            message:
                'Erro interno ao realizar login.'
        });
    }
}

async function perfil(req, res) {
    try {
        const usuario =
            await authModel.buscarUsuarioPorId(
                req.usuario.id_usuario
            );

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message:
                    'Usuário não encontrado.'
            });
        }

        return res.status(200).json({
            success: true,
            data: usuario
        });

    } catch (error) {
        console.error(
            'Erro ao buscar perfil:',
            error
        );

        return res.status(500).json({
            success: false,
            message:
                'Erro interno ao buscar perfil.'
        });
    }
}

module.exports = {
    cadastro,
    login,
    perfil
};