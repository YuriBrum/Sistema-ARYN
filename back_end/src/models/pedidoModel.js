const db = require('../config/database');

const PedidoModel = {

    async listarTodos() {
        const [rows] = await db.execute(`
            SELECT
                p.*
            FROM pedidos p
            ORDER BY p.id_pedido DESC
        `);

        return rows;
    },

    async buscarPorId(id) {
        const [rows] = await db.execute(`
            SELECT
                p.*
            FROM pedidos p
            WHERE p.id_pedido = ?
        `, [id]);

        return rows[0] || null;
    },

    async criar(dados) {
        const {
            id_cliente
        } = dados;

        const [result] = await db.execute(`
            INSERT INTO pedidos (
                id_cliente
            )
            VALUES (?)
        `, [
            id_cliente
        ]);

        return this.buscarPorId(result.insertId);
    },

    async atualizar(id, dados) {
        const {
            id_cliente,
            status,
            valor_total
        } = dados;

        await db.execute(`
            UPDATE pedidos
            SET
                id_cliente = ?,
                status = ?,
                valor_total = ?
            WHERE id_pedido = ?
        `, [
            id_cliente,
            status,
            valor_total,
            id
        ]);

        return this.buscarPorId(id);
    },

    async excluir(id) {
        const [result] = await db.execute(`
            DELETE FROM pedidos
            WHERE id_pedido = ?
        `, [id]);

        return result.affectedRows > 0;
    }
};

module.exports = PedidoModel;