const express = require('express');
const dotenv = require('dotenv');
const pool = require('./src/config/database');
const statusRoutes = require('./src/routes/statusRoutes');

dotenv.config();

const app = express();

app.use(express.json());

// Rotas
app.use('/api/status', statusRoutes);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API ARYN funcionando!'
    });
});

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        const connection = await pool.getConnection();

        console.log('Banco de dados conectado com sucesso!');

        connection.release();

        app.listen(PORT, () => {
            console.log(`Servidor ARYN rodando na porta ${PORT}`);
        });

    } catch (error) {
        console.error('Erro ao conectar com o banco de dados:');
        console.error(error.message);
    }
}

iniciarServidor();