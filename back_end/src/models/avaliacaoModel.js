const db = require('../config/database');

const AvaliacaoModel = {

    async listarTodas() {
        const [rows] = await db.execute(`
            SELECT
                a.*
            FROM avaliacoes_produto a
            ORDER BY a.id_avaliacao DESC
        `);

        return rows;
    },

    async buscarPorId(id) {
        const [rows] = await db.execute(`
            SELECT
                a.*
            FROM avaliacoes_produto a
            WHERE a.id_avaliacao = ?
        `, [id]);

        return rows[0] || null;
    },

    async listarPorProduto(idProduto) {
        const [rows] = await db.execute(`
            SELECT
                a.*
            FROM avaliacoes_produto a
            WHERE a.id_produto = ?
            ORDER BY a.id_avaliacao DESC
        `, [idProduto]);

        return rows;
    },

    async criar(dados) {
        const {
            id_cliente,
            id_produto,
            nota,
            comentario
        } = dados;

        const [result] = await db.execute(`
            INSERT INTO avaliacoes_produto (
                id_cliente,
                id_produto,
                nota,
                comentario
            )
            VALUES (?, ?, ?, ?)
        `, [
            id_cliente,
            id_produto,
            nota,
            comentario
        ]);

        return this.buscarPorId(result.insertId);
    },

    async atualizar(id, dados) {
        const {
            nota,
            comentario
        } = dados;

        await db.execute(`
            UPDATE avaliacoes_produto
            SET
                nota = ?,
                comentario = ?
            WHERE id_avaliacao = ?
        `, [
            nota,
            comentario,
            id
        ]);

        return this.buscarPorId(id);
    },

    async excluir(id) {
        const [result] = await db.execute(`
            DELETE FROM avaliacoes_produto
            WHERE id_avaliacao = ?
        `, [id]);

        return result.affectedRows > 0;
    }
};

module.exports = AvaliacaoModel;