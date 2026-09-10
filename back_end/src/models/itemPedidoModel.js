const db = require('../config/database');

const ItemPedidoModel = {

    async listarTodos() {
        const [rows] = await db.execute(`
            SELECT
                i.*
            FROM itens_pedido i
            ORDER BY i.id_item_pedido DESC
        `);

        return rows;
    },

    async buscarPorId(id) {
        const [rows] = await db.execute(`
            SELECT
                i.*
            FROM itens_pedido i
            WHERE i.id_item_pedido = ?
        `, [id]);

        return rows[0] || null;
    },

    async listarPorPedido(idPedido) {
        const [rows] = await db.execute(`
            SELECT
                i.*
            FROM itens_pedido i
            WHERE i.id_pedido = ?
            ORDER BY i.id_item_pedido ASC
        `, [idPedido]);

        return rows;
    },

    async criar(dados) {
        const {
            id_pedido,
            id_produto,
            quantidade,
            preco_unitario
        } = dados;

        const [result] = await db.execute(`
            INSERT INTO itens_pedido (
                id_pedido,
                id_produto,
                quantidade,
                preco_unitario
            )
            VALUES (?, ?, ?, ?)
        `, [
            id_pedido,
            id_produto,
            quantidade,
            preco_unitario
        ]);

        return this.buscarPorId(result.insertId);
    },

    async atualizar(id, dados) {
        const {
            id_pedido,
            id_produto,
            quantidade,
            preco_unitario
        } = dados;

        await db.execute(`
            UPDATE itens_pedido
            SET
                id_pedido = ?,
                id_produto = ?,
                quantidade = ?,
                preco_unitario = ?
            WHERE id_item_pedido = ?
        `, [
            id_pedido,
            id_produto,
            quantidade,
            preco_unitario,
            id
        ]);

        return this.buscarPorId(id);
    },

    async excluir(id) {
        const [result] = await db.execute(`
            DELETE FROM itens_pedido
            WHERE id_item_pedido = ?
        `, [id]);

        return result.affectedRows > 0;
    }
};

module.exports = ItemPedidoModel;