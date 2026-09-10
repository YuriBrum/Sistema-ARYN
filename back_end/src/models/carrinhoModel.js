const pool = require('../config/database');

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

async function buscarCarrinhoAtivo(id_cliente) {

    const [rows] = await pool.query(
        `
        SELECT
            id_carrinho,
            id_cliente,
            status,
            criado_em,
            atualizado_em
        FROM carrinhos
        WHERE id_cliente = ?
          AND status = 'ATIVO'
        LIMIT 1
        `,
        [id_cliente]
    );

    return rows[0] || null;
}

async function criarCarrinho(id_cliente) {

    const [result] = await pool.query(
        `
        INSERT INTO carrinhos
        (
            id_cliente,
            status
        )
        VALUES (?, 'ATIVO')
        `,
        [id_cliente]
    );

    return result.insertId;
}

async function buscarOuCriarCarrinho(id_cliente) {

    let carrinho =
        await buscarCarrinhoAtivo(id_cliente);

    if (carrinho) {
        return carrinho;
    }

    const id_carrinho =
        await criarCarrinho(id_cliente);

    return await buscarCarrinhoPorId(id_carrinho);
}

async function buscarCarrinhoPorId(id_carrinho) {

    const [rows] = await pool.query(
        `
        SELECT
            id_carrinho,
            id_cliente,
            status,
            criado_em,
            atualizado_em
        FROM carrinhos
        WHERE id_carrinho = ?
        LIMIT 1
        `,
        [id_carrinho]
    );

    return rows[0] || null;
}

async function buscarItensCarrinho(id_carrinho) {

    const [rows] = await pool.query(
        `
        SELECT
            ci.id_item,
            ci.id_carrinho,
            ci.id_produto,
            ci.quantidade,
            ci.preco_unitario,
            ci.criado_em,
            ci.atualizado_em,

            p.nome AS produto_nome

        FROM carrinho_itens ci

        INNER JOIN produtos p
            ON p.id_produto = ci.id_produto

        WHERE ci.id_carrinho = ?

        ORDER BY ci.criado_em ASC
        `,
        [id_carrinho]
    );

    return rows;
}

async function buscarItemPorId(
    id_item,
    id_carrinho
) {

    const [rows] = await pool.query(
        `
        SELECT
            ci.id_item,
            ci.id_carrinho,
            ci.id_produto,
            ci.quantidade,
            ci.preco_unitario
        FROM carrinho_itens ci
        WHERE ci.id_item = ?
          AND ci.id_carrinho = ?
        LIMIT 1
        `,
        [
            id_item,
            id_carrinho
        ]
    );

    return rows[0] || null;
}

async function buscarItemPorProduto(
    id_carrinho,
    id_produto
) {

    const [rows] = await pool.query(
        `
        SELECT
            id_item,
            id_carrinho,
            id_produto,
            quantidade,
            preco_unitario
        FROM carrinho_itens
        WHERE id_carrinho = ?
          AND id_produto = ?
        LIMIT 1
        `,
        [
            id_carrinho,
            id_produto
        ]
    );

    return rows[0] || null;
}

async function adicionarItem(
    id_carrinho,
    id_produto,
    quantidade,
    preco_unitario
) {

    const [result] = await pool.query(
        `
        INSERT INTO carrinho_itens
        (
            id_carrinho,
            id_produto,
            quantidade,
            preco_unitario
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            id_carrinho,
            id_produto,
            quantidade,
            preco_unitario
        ]
    );

    return result.insertId;
}

async function atualizarItem(
    id_item,
    id_carrinho,
    quantidade
) {

    const [result] = await pool.query(
        `
        UPDATE carrinho_itens
        SET
            quantidade = ?,
            atualizado_em = CURRENT_TIMESTAMP
        WHERE id_item = ?
          AND id_carrinho = ?
        `,
        [
            quantidade,
            id_item,
            id_carrinho
        ]
    );

    return result.affectedRows > 0;
}

async function removerItem(
    id_item,
    id_carrinho
) {

    const [result] = await pool.query(
        `
        DELETE FROM carrinho_itens
        WHERE id_item = ?
          AND id_carrinho = ?
        `,
        [
            id_item,
            id_carrinho
        ]
    );

    return result.affectedRows > 0;
}

async function limparCarrinho(id_carrinho) {

    await pool.query(
        `
        DELETE FROM carrinho_itens
        WHERE id_carrinho = ?
        `,
        [id_carrinho]
    );
}

async function contarItens(id_carrinho) {

    const [rows] = await pool.query(
        `
        SELECT
            COALESCE(SUM(quantidade), 0) AS quantidade
        FROM carrinho_itens
        WHERE id_carrinho = ?
        `,
        [id_carrinho]
    );

    return Number(rows[0].quantidade);
}

module.exports = {

    buscarClientePorUsuario,
    buscarCarrinhoAtivo,
    criarCarrinho,
    buscarOuCriarCarrinho,
    buscarCarrinhoPorId,
    buscarItensCarrinho,
    buscarItemPorId,
    buscarItemPorProduto,
    adicionarItem,
    atualizarItem,
    removerItem,
    limparCarrinho,
    contarItens

};