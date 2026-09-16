const PedidoModel = require('../models/pedidoModel');

class PedidoController {

    // GET /api/pedidos
    static async listar(req, res) {
        try {
            const pedidos = await PedidoModel.listarTodos();

            return res.status(200).json({
                success: true,
                message: 'Pedidos listados com sucesso.',
                data: pedidos
            });

        } catch (error) {
            console.error('Erro ao listar pedidos:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao listar pedidos.'
            });
        }
    }

    // GET /api/pedidos/:id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do pedido inválido.'
                });
            }

            const pedido =
                await PedidoModel.buscarPorId(id);

            if (!pedido) {
                return res.status(404).json({
                    success: false,
                    message: 'Pedido não encontrado.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Pedido encontrado com sucesso.',
                data: pedido
            });

        } catch (error) {
            console.error('Erro ao buscar pedido:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao buscar pedido.'
            });
        }
    }

    // POST /api/pedidos
    static async criar(req, res) {
        try {
            const dados = req.body;

            if (
                !dados.id_cliente ||
                !Number.isInteger(Number(dados.id_cliente))
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'O id_cliente é obrigatório.'
                });
            }

            const pedido =
                await PedidoModel.criar(dados);

            return res.status(201).json({
                success: true,
                message: 'Pedido criado com sucesso.',
                data: pedido
            });

        } catch (error) {
            console.error('Erro ao criar pedido:', error);

            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({
                    success: false,
                    message: 'O cliente informado não existe.'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao criar pedido.'
            });
        }
    }

    // PUT /api/pedidos/:id
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dados = req.body;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do pedido inválido.'
                });
            }

            const pedido =
                await PedidoModel.buscarPorId(id);

            if (!pedido) {
                return res.status(404).json({
                    success: false,
                    message: 'Pedido não encontrado.'
                });
            }

            await PedidoModel.atualizar(id, dados);

            const atualizado =
                await PedidoModel.buscarPorId(id);

            return res.status(200).json({
                success: true,
                message: 'Pedido atualizado com sucesso.',
                data: atualizado
            });

        } catch (error) {
            console.error('Erro ao atualizar pedido:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao atualizar pedido.'
            });
        }
    }

    // DELETE /api/pedidos/:id
    static async excluir(req, res) {
        try {
            const { id } = req.params;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do pedido inválido.'
                });
            }

            const pedido =
                await PedidoModel.buscarPorId(id);

            if (!pedido) {
                return res.status(404).json({
                    success: false,
                    message: 'Pedido não encontrado.'
                });
            }

            await PedidoModel.excluir(id);

            return res.status(200).json({
                success: true,
                message: 'Pedido excluído com sucesso.'
            });

        } catch (error) {
            console.error('Erro ao excluir pedido:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao excluir pedido.'
            });
        }
    }
}

module.exports = PedidoController;