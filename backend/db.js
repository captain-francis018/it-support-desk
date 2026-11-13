// Charger les variables du fichier .env
require("dotenv").config();

// Importer le Pool de PostgreSQL
const { Pool } = require("pg");

// Créer un pool de connexions
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

// Exporter le pool pour les autres fichiers
module.exports = pool;
