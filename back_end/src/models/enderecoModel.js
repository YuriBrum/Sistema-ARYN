const pool = require('../config/database');

async function listarEnderecos(id_cliente) {
    const [rows] = await pool.query(`
        SELECT
            id_endereco,
            id_cliente,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            principal
        FROM enderecos
        WHERE id_cliente = ?
        ORDER BY
            principal DESC,
            id_endereco DESC
    `, [id_cliente]);

    return rows;
}

async function buscarEnderecoPorId(
    id_endereco,
    id_cliente
) {
    const [rows] = await pool.query(`
        SELECT
            id_endereco,
            id_cliente,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            principal
        FROM enderecos
        WHERE
            id_endereco = ?
            AND id_cliente = ?
        LIMIT 1
    `, [
        id_endereco,
        id_cliente
    ]);

    return rows[0];
}

async function criarEndereco(
    id_cliente,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    principal
) {
    const connection =
        await pool.getConnection();

    try {
        await connection.beginTransaction();

        if (principal) {
            await connection.query(`
                UPDATE enderecos
                SET principal = 0
                WHERE id_cliente = ?
            `, [id_cliente]);
        }

        const [result] =
            await connection.query(`
                INSERT INTO enderecos (
                    id_cliente,
                    cep,
                    logradouro,
                    numero,
                    complemento,
                    bairro,
                    cidade,
                    estado,
                    principal
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                id_cliente,
                cep,
                logradouro,
                numero,
                complemento || null,
                bairro,
                cidade,
                estado,
                principal ? 1 : 0
            ]);

        await connection.commit();

        return buscarEnderecoPorId(
            result.insertId,
            id_cliente
        );

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

async function atualizarEndereco(
    id_endereco,
    id_cliente,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    principal
) {
    const connection =
        await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [enderecos] =
            await connection.query(`
                SELECT
                    id_endereco
                FROM enderecos
                WHERE
                    id_endereco = ?
                    AND id_cliente = ?
                LIMIT 1
            `, [
                id_endereco,
                id_cliente
            ]);

        if (enderecos.length === 0) {
            await connection.rollback();
            return null;
        }

        if (principal) {
            await connection.query(`
                UPDATE enderecos
                SET principal = 0
                WHERE id_cliente = ?
            `, [id_cliente]);
        }

        await connection.query(`
            UPDATE enderecos
            SET
                cep = ?,
                logradouro = ?,
                numero = ?,
                complemento = ?,
                bairro = ?,
                cidade = ?,
                estado = ?,
                principal = ?
            WHERE
                id_endereco = ?
                AND id_cliente = ?
        `, [
            cep,
            logradouro,
            numero,
            complemento || null,
            bairro,
            cidade,
            estado,
            principal ? 1 : 0,
            id_endereco,
            id_cliente
        ]);

        await connection.commit();

        return buscarEnderecoPorId(
            id_endereco,
            id_cliente
        );

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

async function excluirEndereco(
    id_endereco,
    id_cliente
) {
    const [result] = await pool.query(`
        DELETE FROM enderecos
        WHERE
            id_endereco = ?
            AND id_cliente = ?
    `, [
        id_endereco,
        id_cliente
    ]);

    return result.affectedRows > 0;
}

async function definirEnderecoPrincipal(
    id_endereco,
    id_cliente
) {
    const connection =
        await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [enderecos] =
            await connection.query(`
                SELECT
                    id_endereco
                FROM enderecos
                WHERE
                    id_endereco = ?
                    AND id_cliente = ?
                LIMIT 1
            `, [
                id_endereco,
                id_cliente
            ]);

        if (enderecos.length === 0) {
            await connection.rollback();
            return null;
        }

        await connection.query(`
            UPDATE enderecos
            SET principal = 0
            WHERE id_cliente = ?
        `, [id_cliente]);

        await connection.query(`
            UPDATE enderecos
            SET principal = 1
            WHERE
                id_endereco = ?
                AND id_cliente = ?
        `, [
            id_endereco,
            id_cliente
        ]);

        await connection.commit();

        return buscarEnderecoPorId(
            id_endereco,
            id_cliente
        );

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

module.exports = {
    listarEnderecos,
    buscarEnderecoPorId,
    criarEndereco,
    atualizarEndereco,
    excluirEndereco,
    definirEnderecoPrincipal
};