const express = require('express');
const router = express.Router();

const { getStatus } = require('../controllers/statusController');
const { listarCategorias, buscarCategoriaPorId, cadastrarCategoria } = require('../controllers/categoriaController');
const { listarProdutos, listarNovidades, listarOfertas, buscarProdutoPorId, criarProduto, atualizarProduto, removerProduto } = require('../controllers/produtoController');
const { listarUsuarios, buscarUsuarioPorId, cadastrarUsuario, loginUsuario } = require('../controllers/usuarioController');
const { listarPedidos, buscarPedidoPorId, criarPedido } = require('../controllers/pedidoController');
const { listarCarrinho, adicionarItemCarrinho, removerItemCarrinho } = require('../controllers/carrinhoController');
const { autenticar, autorizar } = require('../src/middlewares/authMiddleware');

router.get('/status', getStatus);

router.get('/categorias', listarCategorias);
router.get('/categorias/:id', buscarCategoriaPorId);
router.post('/categorias', autenticar, autorizar('ADMIN'), cadastrarCategoria);

router.get('/produtos', listarProdutos);
router.get('/produtos/novidades', listarNovidades);
router.get('/produtos/ofertas', listarOfertas);
router.get('/produtos/:id', buscarProdutoPorId);
router.post('/produtos', autenticar, autorizar('ADMIN'), criarProduto);
router.put('/produtos/:id', autenticar, autorizar('ADMIN'), atualizarProduto);
router.delete('/produtos/:id', autenticar, autorizar('ADMIN'), removerProduto);

router.get('/usuarios', listarUsuarios);
router.get('/usuarios/:id', buscarUsuarioPorId);
router.post('/usuarios', cadastrarUsuario);
router.post('/usuarios/login', loginUsuario);

router.get('/pedidos', listarPedidos);
router.get('/pedidos/:id', buscarPedidoPorId);
router.post('/pedidos', criarPedido);

router.get('/carrinho', listarCarrinho);
router.post('/carrinho', adicionarItemCarrinho);
router.delete('/carrinho/:id_item', removerItemCarrinho);

module.exports = router;
