const { Kysely, PostgresDialect } = require('kysely');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const db = new Kysely({
  dialect: new PostgresDialect({ pool }),
});

module.exports = db;