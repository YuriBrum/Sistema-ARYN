const express = require('express');
const cors = require('cors');

const produtoRoutes = require('./routes/produtoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {

    res.json({
        success: true,
        message: 'API ARYN funcionando!'
    });

});

app.use('/api/produtos', produtoRoutes);

app.use('/api/categorias', categoriaRoutes);

app.use('/api/usuarios', usuarioRoutes);

module.exports = app;