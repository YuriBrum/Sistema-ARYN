const pool = require('../config/database');

const Cliente = {

    async listarTodos() {
        const [clientes] = await pool.query(`
            SELECT
                c.id_cliente,
                c.id_usuario,
                u.nome,
                u.email,
                c.telefone,
                c.data_nascimento
            FROM clientes AS c
            INNER JOIN usuarios AS u
                ON u.id_usuario = c.id_usuario
            ORDER BY c.id_cliente DESC
        `);

        return clientes;
    },

    async buscarPorId(id) {
        const [clientes] = await pool.query(`
            SELECT
                c.id_cliente,
                c.id_usuario,
                u.nome,
                u.email,
                c.telefone,
                c.data_nascimento
            FROM clientes AS c
            INNER JOIN usuarios AS u
                ON u.id_usuario = c.id_usuario
            WHERE c.id_cliente = ?
        `, [id]);

        return clientes[0];
    },

    async buscarPorUsuario(idUsuario) {
        const [clientes] = await pool.query(`
            SELECT
                c.id_cliente,
                c.id_usuario,
                u.nome,
                u.email,
                c.telefone,
                c.data_nascimento
            FROM clientes AS c
            INNER JOIN usuarios AS u
                ON u.id_usuario = c.id_usuario
            WHERE c.id_usuario = ?
        `, [idUsuario]);

        return clientes[0];
    }

};

module.exports = Cliente;