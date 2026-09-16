const { pool } = require('../config/database');

async function listarCarrinho(req, res) {
  try {
    const { usuarioId } = req.query;

    if (!usuarioId) {
      return res.status(400).json({ success: false, message: 'É necessário informar o id do usuário.' });
    }

    const [rows] = await pool.query(`
      SELECT ic.*, p.nome AS nome_produto, p.imagem, ic.preco_unitario
      FROM carrinhos c
      INNER JOIN carrinho_itens ic ON ic.id_carrinho = c.id_carrinho
      INNER JOIN produtos p ON p.id_produto = ic.id_produto
      WHERE c.id_cliente = ?
      ORDER BY ic.criado_em DESC
    `, [usuarioId]);

    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao listar carrinho.', details: error.message });
  }
}

async function adicionarItemCarrinho(req, res) {
  try {
    const { id_cliente, id_produto, quantidade = 1 } = req.body;

    if (!id_cliente || !id_produto || !Number.isInteger(Number(quantidade)) || Number(quantidade) < 1) {
      return res.status(400).json({ success: false, message: 'Cliente, produto e quantidade válida são obrigatórios.' });
    }

    let [carrinho] = await pool.query('SELECT id_carrinho FROM carrinhos WHERE id_cliente = ?', [id_cliente]);

    if (!carrinho.length) {
      const [novoCarrinho] = await pool.query('INSERT INTO carrinhos (id_cliente) VALUES (?)', [id_cliente]);
      carrinho = [{ id_carrinho: novoCarrinho.insertId }];
    }

    const idCarrinho = carrinho[0].id_carrinho;

    const [itemExistente] = await pool.query(
      'SELECT id_item, quantidade FROM carrinho_itens WHERE id_carrinho = ? AND id_produto = ?',
      [idCarrinho, id_produto]
    );

    if (itemExistente.length) {
      const novaQuantidade = itemExistente[0].quantidade + Number(quantidade);
      await pool.query(
        'UPDATE carrinho_itens SET quantidade = ? WHERE id_item = ?',
        [novaQuantidade, itemExistente[0].id_item]
      );
      return res.json({ success: true, message: 'Quantidade do item atualizada no carrinho.' });
    }

    const [produto] = await pool.query('SELECT preco FROM produtos WHERE id_produto = ? AND status = 1', [id_produto]);
    if (!produto.length) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado ou inativo.' });
    }

    await pool.query(
      'INSERT INTO carrinho_itens (id_carrinho, id_produto, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
      [idCarrinho, id_produto, quantidade, produto[0].preco]
    );

    res.status(201).json({ success: true, message: 'Item adicionado ao carrinho.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao adicionar item ao carrinho.', details: error.message });
  }
}

async function removerItemCarrinho(req, res) {
  try {
    const { id_item } = req.params;
    const [result] = await pool.query('DELETE FROM carrinho_itens WHERE id_item = ?', [id_item]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Item do carrinho não encontrado.' });
    }

    res.json({ success: true, message: 'Item removido do carrinho.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao remover item do carrinho.', details: error.message });
  }
}

module.exports = {
  listarCarrinho,
  adicionarItemCarrinho,
  removerItemCarrinho
};
