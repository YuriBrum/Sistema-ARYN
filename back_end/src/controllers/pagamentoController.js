const db = require("../config/database");

async function listarPagamentos(req, res) {
    try {
        const clienteId = req.user.id;

        const [pagamentos] = await db.execute(
            `
            SELECT
                pg.id,
                pg.pedido_id,
                pg.metodo,
                pg.status,
                pg.valor,
                pg.transacao_id,
                pg.pago_em,
                pg.criado_em
            FROM pagamentos pg
            INNER JOIN pedidos p
                ON p.id = pg.pedido_id
            WHERE p.cliente_id = ?
            ORDER BY pg.criado_em DESC
            `,
            [clienteId]
        );

        res.status(200).json({
            sucesso: true,
            pagamentos
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao listar pagamentos."
        });
    }
}


async function obterPagamento(req, res) {
    try {
        const clienteId = req.user.id;
        const pagamentoId = req.params.id;

        const [pagamentos] = await db.execute(
            `
            SELECT
                pg.id,
                pg.pedido_id,
                pg.metodo,
                pg.status,
                pg.valor,
                pg.transacao_id,
                pg.pago_em,
                pg.criado_em,
                pg.atualizado_em
            FROM pagamentos pg
            INNER JOIN pedidos p
                ON p.id = pg.pedido_id
            WHERE pg.id = ?
              AND p.cliente_id = ?
            `,
            [pagamentoId, clienteId]
        );

        if (pagamentos.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Pagamento não encontrado."
            });
        }

        res.status(200).json({
            sucesso: true,
            pagamento: pagamentos[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao buscar pagamento."
        });
    }
}


async function atualizarPagamento(req, res) {
    const connection = await db.getConnection();

    try {
        const pagamentoId = req.params.id;
        const { status, transacao_id } = req.body;

        const statusPermitidos = [
            "PENDENTE",
            "APROVADO",
            "RECUSADO",
            "CANCELADO",
            "ESTORNADO"
        ];

        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Status de pagamento inválido."
            });
        }

        await connection.beginTransaction();

        const [pagamentos] = await connection.execute(
            `
            SELECT *
            FROM pagamentos
            WHERE id = ?
            FOR UPDATE
            `,
            [pagamentoId]
        );

        if (pagamentos.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                sucesso: false,
                mensagem: "Pagamento não encontrado."
            });
        }

        const pagamento = pagamentos[0];

        await connection.execute(
            `
            UPDATE pagamentos
            SET
                status = ?,
                transacao_id = ?,
                pago_em = CASE
                    WHEN ? = 'APROVADO'
                    THEN NOW()
                    ELSE pago_em
                END
            WHERE id = ?
            `,
            [
                status,
                transacao_id || null,
                status,
                pagamentoId
            ]
        );

        if (status === "APROVADO") {

            await connection.execute(
                `
                UPDATE pedidos
                SET status = 'PAGO'
                WHERE id = ?
                  AND status = 'AGUARDANDO_PAGAMENTO'
                `,
                [pagamento.pedido_id]
            );
        }

        if (
            status === "RECUSADO" ||
            status === "CANCELADO"
        ) {
            await connection.execute(
                `
                UPDATE pedidos
                SET status = 'CANCELADO'
                WHERE id = ?
                  AND status = 'AGUARDANDO_PAGAMENTO'
                `,
                [pagamento.pedido_id]
            );
        }

        await connection.commit();

        res.status(200).json({
            sucesso: true,
            mensagem: "Pagamento atualizado."
        });

    } catch (error) {

        await connection.rollback();

        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao atualizar pagamento."
        });

    } finally {
        connection.release();
    }
}


module.exports = {
    listarPagamentos,
    obterPagamento,
    atualizarPagamento
};