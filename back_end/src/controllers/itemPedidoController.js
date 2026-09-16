const ItemPedidoModel = require('../models/itemPedidoModel');

class ItemPedidoController {

    // GET /api/itens-pedido
    static async listar(req, res) {
        try {
            const itens =
                await ItemPedidoModel.listarTodos();

            return res.status(200).json({
                success: true,
                message: 'Itens de pedidos listados com sucesso.',
                data: itens
            });

        } catch (error) {
            console.error('Erro ao listar itens:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao listar itens.'
            });
        }
    }

    // GET /api/itens-pedido/:id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do item inválido.'
                });
            }

            const item =
                await ItemPedidoModel.buscarPorId(id);

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Item do pedido não encontrado.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Item encontrado com sucesso.',
                data: item
            });

        } catch (error) {
            console.error('Erro ao buscar item:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao buscar item.'
            });
        }
    }

    // GET /api/itens-pedido/pedido/:id_pedido
    static async listarPorPedido(req, res) {
        try {
            const { id_pedido } = req.params;

            if (
                !Number.isInteger(Number(id_pedido)) ||
                Number(id_pedido) <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do pedido inválido.'
                });
            }

            const itens =
                await ItemPedidoModel.listarPorPedido(id_pedido);

            return res.status(200).json({
                success: true,
                message: 'Itens do pedido listados com sucesso.',
                data: itens
            });

        } catch (error) {
            console.error('Erro ao listar itens do pedido:', error);

            return res.status(500).json({
                success: false,
                message:
                    'Erro interno ao listar itens do pedido.'
            });
        }
    }

    // POST /api/itens-pedido
    static async criar(req, res) {
        try {
            const dados = req.body;

            if (!dados.id_pedido) {
                return res.status(400).json({
                    success: false,
                    message: 'O id_pedido é obrigatório.'
                });
            }

            if (!dados.id_produto) {
                return res.status(400).json({
                    success: false,
                    message: 'O id_produto é obrigatório.'
                });
            }

            if (
                !dados.quantidade ||
                !Number.isInteger(Number(dados.quantidade)) ||
                Number(dados.quantidade) <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'A quantidade deve ser maior que zero.'
                });
            }

            const item =
                await ItemPedidoModel.criar(dados);

            return res.status(201).json({
                success: true,
                message: 'Item adicionado ao pedido com sucesso.',
                data: item
            });

        } catch (error) {
            console.error('Erro ao criar item:', error);

            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({
                    success: false,
                    message:
                        'Pedido ou produto informado não existe.'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao criar item.'
            });
        }
    }

    // PUT /api/itens-pedido/:id
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dados = req.body;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do item inválido.'
                });
            }

            if (
                dados.quantidade !== undefined &&
                (
                    !Number.isInteger(Number(dados.quantidade)) ||
                    Number(dados.quantidade) <= 0
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'A quantidade deve ser maior que zero.'
                });
            }

            const item =
                await ItemPedidoModel.buscarPorId(id);

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Item do pedido não encontrado.'
                });
            }

            await ItemPedidoModel.atualizar(id, dados);

            const atualizado =
                await ItemPedidoModel.buscarPorId(id);

            return res.status(200).json({
                success: true,
                message: 'Item atualizado com sucesso.',
                data: atualizado
            });

        } catch (error) {
            console.error('Erro ao atualizar item:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao atualizar item.'
            });
        }
    }

    // DELETE /api/itens-pedido/:id
    static async excluir(req, res) {
        try {
            const { id } = req.params;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do item inválido.'
                });
            }

            const item =
                await ItemPedidoModel.buscarPorId(id);

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Item do pedido não encontrado.'
                });
            }

            await ItemPedidoModel.excluir(id);

            return res.status(200).json({
                success: true,
                message: 'Item excluído com sucesso.'
            });

        } catch (error) {
            console.error('Erro ao excluir item:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao excluir item.'
            });
        }
    }
}

module.exports = ItemPedidoController;