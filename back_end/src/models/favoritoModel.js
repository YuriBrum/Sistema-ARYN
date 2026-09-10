const pool =
    require('../config/database');

async function buscarClientePorUsuario(id_usuario) {

    const [rows] = await pool.query(
        `
        SELECT id_cliente
        FROM clientes
        WHERE id_usuario = ?
        LIMIT 1
        `,
        [id_usuario]
    );

    return rows[0] || null;
}

async function listar(id_cliente) {

    const [rows] = await pool.query(
        `
        SELECT
            f.id_favorito,
            f.id_produto,
            f.criado_em,

            p.nome AS produto_nome,
            p.preco

        FROM favoritos f

        INNER JOIN produtos p
            ON p.id_produto = f.id_produto

        WHERE f.id_cliente = ?

        ORDER BY f.criado_em DESC
        `,
        [id_cliente]
    );

    return rows;
}

async function buscar(
    id_cliente,
    id_produto
) {

    const [rows] = await pool.query(
        `
        SELECT
            id_favorito,
            id_cliente,
            id_produto,
            criado_em
        FROM favoritos
        WHERE id_cliente = ?
          AND id_produto = ?
        LIMIT 1
        `,
        [
            id_cliente,
            id_produto
        ]
    );

    return rows[0] || null;
}

async function adicionar(
    id_cliente,
    id_produto
) {

    const [result] = await pool.query(
        `
        INSERT INTO favoritos
        (
            id_cliente,
            id_produto
        )
        VALUES (?, ?)
        `,
        [
            id_cliente,
            id_produto
        ]
    );

    return result.insertId;
}

async function remover(
    id_cliente,
    id_produto
) {

    const [result] = await pool.query(
        `
        DELETE FROM favoritos
        WHERE id_cliente = ?
          AND id_produto = ?
        `,
        [
            id_cliente,
            id_produto
        ]
    );

    return result.affectedRows > 0;
}

module.exports = {

    buscarClientePorUsuario,
    listar,
    buscar,
    adicionar,
    remover

};