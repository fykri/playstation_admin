const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect()
    .then(() => console.log("✅ PostgreSQL connected"))
    .catch((err) => console.error("❌ DB connection error", err));

module.exports = pool;
