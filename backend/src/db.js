require('dotenv').config();
const { Pool } = require('pg');

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

pool.connect()
  .then(() => console.log('📌 Conectado a PostgreSQL'))
  .catch(err => console.error('❌ Error al conectar a PostgreSQL:', err));

module.exports = pool;
