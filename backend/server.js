const express = require('express');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

async function initDb(retries = 10) {
  try {
    await pool.query('CREATE TABLE IF NOT EXISTS visits (id SERIAL PRIMARY KEY, visited_at TIMESTAMP DEFAULT NOW())');
    console.log('DB ready');
  } catch (err) {
    console.log('DB not ready, retrying...', err.message);
    if (retries > 0) setTimeout(() => initDb(retries - 1), 3000);
  }
}
initDb();

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(500).json({ status: 'db down' });
  }
});

app.get('/api/visits', async (req, res) => {
  await pool.query('INSERT INTO visits DEFAULT VALUES');
  const r = await pool.query('SELECT COUNT(*) FROM visits');
  console.log('Visit recorded, total =', r.rows[0].count);
  res.json({ visits: Number(r.rows[0].count) });
});

app.listen(3000, () => console.log('Backend running on port 3000'));
