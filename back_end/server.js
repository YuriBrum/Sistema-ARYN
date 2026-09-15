<<<<<<< HEAD
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
=======
require('dotenv').config();

const app = require('./src/app');
const pool = require('./src/config/database');
>>>>>>> backend

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
<<<<<<< HEAD
        const connection = await pool.getConnection();

        console.log('Banco de dados conectado com sucesso!');

        connection.release();
=======
        const conexao = await pool.getConnection();

        console.log('Banco de dados conectado com sucesso!');

        conexao.release();
>>>>>>> backend

        app.listen(PORT, () => {
            console.log(`Servidor ARYN rodando na porta ${PORT}`);
        });

<<<<<<< HEAD
    } catch (error) {
        console.error('Erro ao conectar com o banco de dados:');
        console.error(error.message);
=======
    } catch (erro) {
        console.error('Erro ao conectar ao banco de dados:');
        console.error(erro.message);

        process.exit(1);
>>>>>>> backend
    }
}

iniciarServidor();