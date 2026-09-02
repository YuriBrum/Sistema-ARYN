const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API ARYN funcionando!'
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ARYN rodando na porta ${PORT}`);
});