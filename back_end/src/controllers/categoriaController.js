const Categoria = require('../models/categoriaModel');

const CategoriaController = {

    async listarTodas(req, res) {

        try {

            const categorias = await Categoria.listarTodas();

            return res.status(200).json({
                success: true,
                data: categorias
            });

        } catch (erro) {

            console.error(
                'Erro ao listar categorias:',
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

            const categoria = await Categoria.buscarPorId(id);

            if (!categoria) {

                return res.status(404).json({
                    success: false,
                    message: 'Categoria não encontrada.'
                });

            }

            return res.status(200).json({
                success: true,
                data: categoria
            });

        } catch (erro) {

            console.error(
                'Erro ao buscar categoria:',
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
                descricao,
                status
            } = req.body;

            if (!nome) {

                return res.status(400).json({
                    success: false,
                    message: 'O nome da categoria é obrigatório.'
                });

            }

            const categoria = await Categoria.criar({
                nome,
                descricao,
                status
            });

            return res.status(201).json({
                success: true,
                message: 'Categoria criada com sucesso.',
                data: categoria
            });

        } catch (erro) {

            console.error(
                'Erro ao criar categoria:',
                erro.message
            );

            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor.'
            });

        }

    }

};

module.exports = CategoriaController;