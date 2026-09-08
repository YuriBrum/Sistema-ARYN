const express = require('express');

const statusRoutes = require('./routes/statusRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const corRoutes = require('./routes/corRoutes');
const tamanhoRoutes = require('./routes/tamanhoRoutes');
const variacaoProdutoRoutes =
    require('./routes/variacaoProdutoRoutes');
const estoqueRoutes =
    require('./routes/estoqueRoutes');

const app = express();

app.use(express.json());

app.use('/api/status', statusRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/cores', corRoutes);
app.use('/api/tamanhos', tamanhoRoutes);
app.use('/api/variacoes', variacaoProdutoRoutes);
app.use('/api/estoque', estoqueRoutes);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API ARYN funcionando!'
    });
});

module.exports = app;