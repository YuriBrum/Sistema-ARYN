const pool = require('../config/database');

async function buscarUsuarioPorEmail(email) {
    const [rows] = await pool.query(`
        SELECT
            id_usuario,
            nome,
            email,
            senha,
            tipo,
            status
        FROM usuarios
        WHERE email = ?
        LIMIT 1
    `, [email]);

    return rows[0];
}

async function buscarUsuarioPorId(id_usuario) {
    const [rows] = await pool.query(`
        SELECT
            id_usuario,
            nome,
            email,
            tipo,
            status
        FROM usuarios
        WHERE id_usuario = ?
        LIMIT 1
    `, [id_usuario]);

    return rows[0];
}

async function criarUsuario(
    connection,
    nome,
    email,
    senha,
    tipo
) {
    const [result] = await connection.query(`
        INSERT INTO usuarios (
            nome,
            email,
            senha,
            tipo
        )
        VALUES (?, ?, ?, ?)
    `, [
        nome,
        email,
        senha,
        tipo
    ]);

    return result.insertId;
}

async function criarCliente(
    connection,
    id_usuario
) {
    const [result] = await connection.query(`
        INSERT INTO clientes (
            id_usuario
        )
        VALUES (?)
    `, [
        id_usuario
    ]);

    return result.insertId;
}

async function cadastrarCliente(
    nome,
    email,
    senha
) {
    const connection =
        await pool.getConnection();

    try {
        await connection.beginTransaction();

        const id_usuario =
            await criarUsuario(
                connection,
                nome,
                email,
                senha,
                'CLIENTE'
            );

        const id_cliente =
            await criarCliente(
                connection,
                id_usuario
            );

        await connection.commit();

        return {
            id_usuario,
            id_cliente
        };

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

module.exports = {
    buscarUsuarioPorEmail,
    buscarUsuarioPorId,
    cadastrarCliente
};