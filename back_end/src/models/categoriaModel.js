const db = require('../config/database');

const CategoriaModel = {

    async listarTodas() {
        const [rows] = await db.execute(`
            SELECT
                id_categoria,
                nome
            FROM categorias
            ORDER BY nome ASC
        `);

        return rows;
    },

    async buscarPorId(id) {
        const [rows] = await db.execute(`
            SELECT
                id_categoria,
                nome
            FROM categorias
            WHERE id_categoria = ?
        `, [id]);

        return rows[0] || null;
    },

    async buscarPorNome(nome) {
        const [rows] = await db.execute(`
            SELECT
                id_categoria,
                nome
            FROM categorias
            WHERE nome = ?
        `, [nome]);

        return rows[0] || null;
    },

    async criar(nome) {
        const [result] = await db.execute(`
            INSERT INTO categorias (nome)
            VALUES (?)
        `, [nome]);

        return this.buscarPorId(result.insertId);
    },

    async atualizar(id, nome) {
        await db.execute(`
            UPDATE categorias
            SET nome = ?
            WHERE id_categoria = ?
        `, [nome, id]);

        return this.buscarPorId(id);
    },

    async excluir(id) {
        const [result] = await db.execute(`
            DELETE FROM categorias
            WHERE id_categoria = ?
        `, [id]);

        return result.affectedRows > 0;
    }
};

module.exports = CategoriaModel;