const pool = require('../config/database');

const Categoria = {

    async listarTodas() {
        const [categorias] = await pool.query(`
            SELECT
                id_categoria,
                nome,
                descricao,
                status,
                criado_em
            FROM categorias
            ORDER BY nome ASC
        `);

        return categorias;
    },

    async buscarPorId(id) {
        const [categorias] = await pool.query(`
            SELECT
                id_categoria,
                nome,
                descricao,
                status,
                criado_em
            FROM categorias
            WHERE id_categoria = ?
        `, [id]);

        return categorias[0];
    },

    async criar(dados) {
        const {
            nome,
            descricao,
            status = 1
        } = dados;

        const [resultado] = await pool.query(`
            INSERT INTO categorias
                (nome, descricao, status)
            VALUES
                (?, ?, ?)
        `, [
            nome,
            descricao,
            status
        ]);

        return {
            id_categoria: resultado.insertId,
            nome,
            descricao,
            status
        };
    }

};

module.exports = Categoria;