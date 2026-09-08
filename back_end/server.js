const dotenv = require('dotenv');
const pool = require('./src/config/database');
const app = require('./src/app');

dotenv.config();

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        const connection = await pool.getConnection();

        console.log('Banco de dados conectado com sucesso!');

        connection.release();

    } catch (error) {
        console.error('Aviso: não foi possível conectar ao banco de dados.');
        console.error(error.message);
    }

    app.listen(PORT, () => {
        console.log(`Servidor ARYN rodando na porta ${PORT}`);
    });
}

iniciarServidor();