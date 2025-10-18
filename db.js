const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "data", "products.db");

async function initDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir) && dir !== "") fs.mkdirSync(dir, { recursive: true });
  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      color TEXT,
      size TEXT,
      mrp REAL NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  return db;
}

module.exports = { initDb };
