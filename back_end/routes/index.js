const express = require('express');
const router = express.Router();

const { getStatus } = require('../controllers/statusController');
const { listarCategorias, buscarCategoriaPorId, cadastrarCategoria } = require('../controllers/categoriaController');
const { listarProdutos, buscarProdutoPorId, criarProduto, atualizarProduto, removerProduto } = require('../controllers/produtoController');
const { listarUsuarios, buscarUsuarioPorId, cadastrarUsuario, loginUsuario } = require('../controllers/usuarioController');
const { listarPedidos, buscarPedidoPorId, criarPedido } = require('../controllers/pedidoController');
const { listarCarrinho, adicionarItemCarrinho, removerItemCarrinho } = require('../controllers/carrinhoController');

router.get('/status', getStatus);

router.get('/categorias', listarCategorias);
router.get('/categorias/:id', buscarCategoriaPorId);
router.post('/categorias', cadastrarCategoria);

router.get('/produtos', listarProdutos);
router.get('/produtos/:id', buscarProdutoPorId);
router.post('/produtos', criarProduto);
router.put('/produtos/:id', atualizarProduto);
router.delete('/produtos/:id', removerProduto);

router.get('/usuarios', listarUsuarios);
router.get('/usuarios/:id', buscarUsuarioPorId);
router.post('/usuarios', cadastrarUsuario);
router.post('/usuarios/login', loginUsuario);

router.get('/pedidos', listarPedidos);
router.get('/pedidos/:id', buscarPedidoPorId);
router.post('/pedidos', criarPedido);

router.get('/carrinho', listarCarrinho);
router.post('/carrinho', adicionarItemCarrinho);
router.delete('/carrinho/:id_item_carrinho', removerItemCarrinho);

module.exports = router;
