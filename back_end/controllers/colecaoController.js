const { pool } = require('../config/database');

const COLECOES = [
  {
    id_colecao: 'formal-essentials',
    nome: 'Formal Essentials',
    slug: 'formal-essentials',
    descricao: 'A essência da elegância masculina.',
    conceito: 'Alfaiataria precisa, camisas impecáveis e acessórios para momentos que exigem presença.',
    filtros: ['terno', 'camisa', 'sapato', 'gravata']
  },
  {
    id_colecao: 'business',
    nome: 'Business',
    slug: 'business',
    descricao: 'Presença e sofisticação para o ambiente profissional.',
    conceito: 'Peças versáteis para construir uma imagem segura, contemporânea e consistente.',
    filtros: ['blazer', 'camisa', 'calça', 'sapato', 'cinto']
  },
  {
    id_colecao: 'evening',
    nome: 'Evening',
    slug: 'evening',
    descricao: 'Peças para momentos que pedem algo extraordinário.',
    conceito: 'Texturas, cortes e detalhes pensados para a noite.',
    filtros: ['smoking', 'terno', 'camisa', 'sapato', 'acessório']
  },
  {
    id_colecao: 'smart-casual',
    nome: 'Smart Casual',
    slug: 'smart-casual',
    descricao: 'Elegância sem esforço para todos os dias.',
    conceito: 'O equilíbrio entre conforto e presença para uma rotina bem vestida.',
    filtros: ['polo', 'blazer', 'calça', 'sapato', 'óculos']
  },
  {
    id_colecao: 'essentials',
    nome: 'Essentials',
    slug: 'essentials',
    descricao: 'Os elementos fundamentais do guarda-roupa masculino.',
    conceito: 'Peças que sustentam combinações versáteis e duradouras.',
    filtros: ['camisa', 'polo', 'calça', 'cinto', 'carteira']
  }
];

function buscarColecao(slug) {
  return COLECOES.find(colecao => colecao.slug === slug);
}

function whereDaColecao(colecao) {
  const partes = colecao.filtros.map(() => '(LOWER(p.nome) LIKE ? OR LOWER(c.nome) LIKE ? OR LOWER(COALESCE(p.descricao, "")) LIKE ?)');
  const valores = colecao.filtros.flatMap(filtro => [`%${filtro}%`, `%${filtro}%`, `%${filtro}%`]);
  return { sql: partes.join(' OR '), valores };
}

async function buscarProdutosDaColecao(colecao, limite = 24) {
  const filtro = whereDaColecao(colecao);
  const [produtos] = await pool.query(`
    SELECT p.*, c.nome AS categoria_nome
    FROM produtos p
    LEFT JOIN categorias c ON c.id_categoria = p.id_categoria
    WHERE p.status = 1 AND (${filtro.sql})
    ORDER BY p.criado_em DESC
    LIMIT ?
  `, [...filtro.valores, Math.min(Math.max(Number(limite) || 24, 1), 100)]);
  return produtos;
}

async function listarColecoes(_req, res) {
  try {
    const data = await Promise.all(COLECOES.map(async colecao => ({
      ...colecao,
      produtos: (await buscarProdutosDaColecao(colecao, 100)).length
    })));
    res.json({ success: true, message: 'Coleções encontradas.', data });
  } catch (error) {
    console.error('Erro ao listar coleções:', error.message);
    res.status(500).json({ success: false, message: 'Não foi possível carregar as coleções.' });
  }
}

async function buscarColecaoPorSlug(req, res) {
  const colecao = buscarColecao(req.params.slug);
  if (!colecao) return res.status(404).json({ success: false, message: 'Coleção não encontrada.' });
  try {
    const produtos = await buscarProdutosDaColecao(colecao, 100);
    res.json({ success: true, data: { ...colecao, produtos: produtos.length } });
  } catch (error) {
    console.error('Erro ao buscar coleção:', error.message);
    res.status(500).json({ success: false, message: 'Não foi possível carregar esta coleção.' });
  }
}

async function listarProdutosDaColecao(req, res) {
  const colecao = buscarColecao(req.params.slug);
  if (!colecao) return res.status(404).json({ success: false, message: 'Coleção não encontrada.' });
  try {
    const produtos = await buscarProdutosDaColecao(colecao, req.query.limite);
    res.json({ success: true, data: produtos, meta: { colecao: colecao.slug, limite: produtos.length } });
  } catch (error) {
    console.error('Erro ao listar produtos da coleção:', error.message);
    res.status(500).json({ success: false, message: 'Não foi possível carregar os produtos desta coleção.' });
  }
}

module.exports = { listarColecoes, buscarColecaoPorSlug, listarProdutosDaColecao };
