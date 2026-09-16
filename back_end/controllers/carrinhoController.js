const { pool } = require('../config/database');

async function listarCarrinho(req, res) {
  try {
    const { usuarioId } = req.query;

    if (!usuarioId) {
      return res.status(400).json({ success: false, message: 'É necessário informar o id do usuário.' });
    }

    const [rows] = await pool.query(`
      SELECT ic.*, vp.id_produto, vp.estoque, p.nome AS nome_produto, p.preco
      FROM carrinhos c
      INNER JOIN itens_carrinho ic ON ic.id_carrinho = c.id_carrinho
      INNER JOIN variacoes_produto vp ON vp.id_variacao = ic.id_variacao
      INNER JOIN produtos p ON p.id_produto = vp.id_produto
      WHERE c.id_cliente = ?
      ORDER BY ic.adicionado_em DESC
    `, [usuarioId]);

    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao listar carrinho.', details: error.message });
  }
}

async function adicionarItemCarrinho(req, res) {
  try {
    const { id_cliente, id_variacao, quantidade = 1 } = req.body;

    if (!id_cliente || !id_variacao) {
      return res.status(400).json({ success: false, message: 'Cliente e variação são obrigatórios.' });
    }

    let [carrinho] = await pool.query('SELECT id_carrinho FROM carrinhos WHERE id_cliente = ?', [id_cliente]);

    if (!carrinho.length) {
      const [novoCarrinho] = await pool.query('INSERT INTO carrinhos (id_cliente) VALUES (?)', [id_cliente]);
      carrinho = [{ id_carrinho: novoCarrinho.insertId }];
    }

    const idCarrinho = carrinho[0].id_carrinho;

    const [itemExistente] = await pool.query(
      'SELECT id_item_carrinho, quantidade FROM itens_carrinho WHERE id_carrinho = ? AND id_variacao = ?',
      [idCarrinho, id_variacao]
    );

    if (itemExistente.length) {
      const novaQuantidade = itemExistente[0].quantidade + Number(quantidade);
      await pool.query(
        'UPDATE itens_carrinho SET quantidade = ? WHERE id_item_carrinho = ?',
        [novaQuantidade, itemExistente[0].id_item_carrinho]
      );
      return res.json({ success: true, message: 'Quantidade do item atualizada no carrinho.' });
    }

    await pool.query(
      'INSERT INTO itens_carrinho (id_carrinho, id_variacao, quantidade) VALUES (?, ?, ?)',
      [idCarrinho, id_variacao, quantidade]
    );

    res.status(201).json({ success: true, message: 'Item adicionado ao carrinho.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao adicionar item ao carrinho.', details: error.message });
  }
}

async function removerItemCarrinho(req, res) {
  try {
    const { id_item_carrinho } = req.params;
    const [result] = await pool.query('DELETE FROM itens_carrinho WHERE id_item_carrinho = ?', [id_item_carrinho]);

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
