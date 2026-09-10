const db = require('../config/database');

const ClienteModel = {

    async listarTodos() {
        const [rows] = await db.execute(`
            SELECT
                id_cliente,
                nome,
                email
            FROM clientes
            ORDER BY id_cliente DESC
        `);

        return rows;
    },

    async buscarPorId(id) {
        const [rows] = await db.execute(`
            SELECT
                id_cliente,
                nome,
                email
            FROM clientes
            WHERE id_cliente = ?
        `, [id]);

        return rows[0] || null;
    },

    async buscarPorEmail(email) {
        const [rows] = await db.execute(`
            SELECT *
            FROM clientes
            WHERE email = ?
        `, [email]);

        return rows[0] || null;
    },

    async criar(dados) {
        const {
            nome,
            email,
            senha
        } = dados;

        const [result] = await db.execute(`
            INSERT INTO clientes (
                nome,
                email,
                senha
            )
            VALUES (?, ?, ?)
        `, [
            nome,
            email,
            senha
        ]);

        return this.buscarPorId(result.insertId);
    },

    async atualizar(id, dados) {
        const {
            nome,
            email,
            senha
        } = dados;

        await db.execute(`
            UPDATE clientes
            SET
                nome = ?,
                email = ?,
                senha = ?
            WHERE id_cliente = ?
        `, [
            nome,
            email,
            senha,
            id
        ]);

        return this.buscarPorId(id);
    },

    async excluir(id) {
        const [result] = await db.execute(`
            DELETE FROM clientes
            WHERE id_cliente = ?
        `, [id]);

        return result.affectedRows > 0;
    }
};

module.exports = ClienteModel;