const pool = require('../config/database');

const Usuario = {

    async listarTodos() {

        const [usuarios] = await pool.query(`
            SELECT
                id_usuario,
                nome,
                email,
                tipo,
                status,
                criado_em,
                atualizado_em
            FROM usuarios
            ORDER BY id_usuario DESC
        `);

        return usuarios;
    },

    async buscarPorId(id) {

        const [usuarios] = await pool.query(`
            SELECT
                id_usuario,
                nome,
                email,
                tipo,
                status,
                criado_em,
                atualizado_em
            FROM usuarios
            WHERE id_usuario = ?
        `, [id]);

        return usuarios[0];
    },

    async buscarPorEmail(email) {

        const [usuarios] = await pool.query(`
            SELECT
                id_usuario,
                nome,
                email,
                senha,
                tipo,
                status,
                criado_em,
                atualizado_em
            FROM usuarios
            WHERE email = ?
        `, [email]);

        return usuarios[0];
    },

    async criar(dados) {

        const {
            nome,
            email,
            senha,
            tipo = 'CLIENTE',
            status = 1
        } = dados;

        const [resultado] = await pool.query(`
            INSERT INTO usuarios
                (nome, email, senha, tipo, status)
            VALUES
                (?, ?, ?, ?, ?)
        `, [
            nome,
            email,
            senha,
            tipo,
            status
        ]);

        return {
            id_usuario: resultado.insertId,
            nome,
            email,
            tipo,
            status
        };
    }

};

module.exports = Usuario;