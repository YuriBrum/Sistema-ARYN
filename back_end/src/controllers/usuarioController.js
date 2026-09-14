const bcrypt = require('bcrypt');

const Usuario = require('../models/usuarioModel');

const UsuarioController = {

    async listarTodos(req, res) {

        try {

            const usuarios = await Usuario.listarTodos();

            return res.status(200).json({
                success: true,
                data: usuarios
            });

        } catch (erro) {

            console.error(
                'Erro ao listar usuários:',
                erro.message
            );

            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor.'
            });

        }

    },

    async buscarPorId(req, res) {

        try {

            const { id } = req.params;

            const usuario = await Usuario.buscarPorId(id);

            if (!usuario) {

                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado.'
                });

            }

            return res.status(200).json({
                success: true,
                data: usuario
            });

        } catch (erro) {

            console.error(
                'Erro ao buscar usuário:',
                erro.message
            );

            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor.'
            });

        }

    },

    async criar(req, res) {

        try {

            const {
                nome,
                email,
                senha,
                tipo,
                status
            } = req.body;

            // Validação dos campos obrigatórios
            if (!nome || !email || !senha) {

                return res.status(400).json({
                    success: false,
                    message: 'Nome, email e senha são obrigatórios.'
                });

            }

            // Verifica se o email já está cadastrado
            const usuarioExistente = await Usuario.buscarPorEmail(email);

            if (usuarioExistente) {

                return res.status(409).json({
                    success: false,
                    message: 'Este email já está cadastrado.'
                });

            }

            // Criptografa a senha
            const senhaHash = await bcrypt.hash(senha, 10);

            // Cria o usuário no banco
            const usuario = await Usuario.criar({
                nome,
                email,
                senha: senhaHash,
                tipo,
                status
            });

            return res.status(201).json({
                success: true,
                message: 'Usuário criado com sucesso.',
                data: usuario
            });

        } catch (erro) {

            console.error(
                'Erro ao criar usuário:',
                erro.message
            );

            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor.'
            });

        }

    }

};

module.exports = UsuarioController;