const estoqueModel =
    require('../models/estoqueModel');

const TIPOS_MOVIMENTACAO = [
    'ENTRADA',
    'SAIDA',
    'AJUSTE',
    'DEVOLUCAO'
];

async function consultarEstoque(req, res) {
    try {
        const { id_variacao } = req.params;

        const estoque =
            await estoqueModel.buscarEstoquePorVariacao(
                id_variacao
            );

        if (!estoque) {
            return res.status(404).json({
                success: false,
                message: 'Variação não encontrada.'
            });
        }

        return res.status(200).json({
            success: true,
            data: estoque
        });

    } catch (error) {
        console.error(
            'Erro ao consultar estoque:',
            error
        );

        return res.status(500).json({
            success: false,
            message:
                'Erro interno ao consultar estoque.'
        });
    }
}

async function listarMovimentacoes(req, res) {
    try {
        const { id_variacao } = req.query;

        const movimentacoes =
            await estoqueModel.listarMovimentacoes(
                id_variacao || null
            );

        return res.status(200).json({
            success: true,
            data: movimentacoes
        });

    } catch (error) {
        console.error(
            'Erro ao listar movimentações:',
            error
        );

        return res.status(500).json({
            success: false,
            message:
                'Erro interno ao listar movimentações.'
        });
    }
}

async function movimentarEstoque(req, res) {
    try {
        const {
            id_variacao,
            tipo,
            quantidade,
            motivo,
            id_pedido,
            id_usuario
        } = req.body;

        if (!id_variacao) {
            return res.status(400).json({
                success: false,
                message:
                    'A variação do produto é obrigatória.'
            });
        }

        if (!TIPOS_MOVIMENTACAO.includes(tipo)) {
            return res.status(400).json({
                success: false,
                message:
                    'Tipo de movimentação inválido. Use ENTRADA, SAIDA, AJUSTE ou DEVOLUCAO.'
            });
        }

        if (
            quantidade === undefined ||
            quantidade === null ||
            Number.isNaN(Number(quantidade)) ||
            Number(quantidade) < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'A quantidade informada é inválida.'
            });
        }

        if (
            tipo !== 'AJUSTE' &&
            Number(quantidade) === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'A quantidade deve ser maior que zero.'
            });
        }

        const movimentacao =
            await estoqueModel.movimentarEstoque({
                id_variacao,
                tipo,
                quantidade,
                motivo,
                id_pedido,
                id_usuario
            });

        return res.status(201).json({
            success: true,
            message:
                'Movimentação de estoque registrada com sucesso.',
            data: movimentacao
        });

    } catch (error) {
        console.error(
            'Erro ao movimentar estoque:',
            error
        );

        if (
            error.message ===
            'VARIACAO_NAO_ENCONTRADA'
        ) {
            return res.status(404).json({
                success: false,
                message:
                    'Variação não encontrada.'
            });
        }

        if (
            error.message ===
            'VARIACAO_INATIVA'
        ) {
            return res.status(409).json({
                success: false,
                message:
                    'Não é possível movimentar o estoque de uma variação inativa.'
            });
        }

        if (
            error.message ===
            'ESTOQUE_INSUFICIENTE'
        ) {
            return res.status(409).json({
                success: false,
                message:
                    'Estoque insuficiente para realizar esta saída.'
            });
        }

        if (
            error.code ===
            'ER_NO_REFERENCED_ROW_2'
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Pedido ou usuário informado não existe.'
            });
        }

        return res.status(500).json({
            success: false,
            message:
                'Erro interno ao movimentar estoque.'
        });
    }
}

module.exports = {
    consultarEstoque,
    listarMovimentacoes,
    movimentarEstoque
};