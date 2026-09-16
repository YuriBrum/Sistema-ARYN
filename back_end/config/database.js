const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aryn_v2',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT) || 10000
});

async function pingDatabase() {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    return rows[0]?.ok === 1;
  } catch (error) {
    console.error(`Falha na conexão MySQL: ${error.message}`);
    return false;
  }
}

module.exports = {
  pool,
  pingDatabase
};
