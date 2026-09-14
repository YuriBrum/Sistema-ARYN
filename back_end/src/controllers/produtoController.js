const Produto = require('../models/produtoModel');

const ProdutoController = {

    async listarTodos(req, res) {

        try {

            const produtos = await Produto.listarTodos();

            return res.status(200).json({
                success: true,
                data: produtos
            });

        } catch (erro) {

            console.error('Erro ao listar produtos:', erro.message);

            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor.'
            });

        }

    },

    async buscarPorId(req, res) {

        try {

            const { id } = req.params;

            const produto = await Produto.buscarPorId(id);

            if (!produto) {
                return res.status(404).json({
                    success: false,
                    message: 'Produto não encontrado.'
                });
            }

            return res.status(200).json({
                success: true,
                data: produto
            });

        } catch (erro) {

            console.error('Erro ao buscar produto:', erro.message);

            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor.'
            });

        }

    },

    async listarPorCategoria(req, res) {

        try {

            const { idCategoria } = req.params;

            const produtos = await Produto.listarPorCategoria(idCategoria);

            return res.status(200).json({
                success: true,
                data: produtos
            });

        } catch (erro) {

            console.error(
                'Erro ao listar produtos por categoria:',
                erro.message
            );

            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor.'
            });

        }

    }

};

module.exports = ProdutoController;