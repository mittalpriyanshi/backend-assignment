const { initDb } = require("../db");

async function insertProducts(products) {
  const db = await initDb();
  const insertStmt = await db.prepare(`
    INSERT OR IGNORE INTO products
      (sku, name, brand, color, size, mrp, price, quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  let stored = 0;
  try {
    await db.run("BEGIN TRANSACTION");
    for (const p of products) {
      const res = await insertStmt.run(
        p.sku,
        p.name,
        p.brand,
        p.color || null,
        p.size || null,
        p.mrp,
        p.price,
        p.quantity
      );
      if (res.changes && res.changes > 0) stored++;
    }
    await db.run("COMMIT");
  } catch (err) {
    await db.run("ROLLBACK");
    throw err;
  } finally {
    await insertStmt.finalize();
  }
  return stored;
}

async function listProducts(page = 1, limit = 20) {
  const db = await initDb();
  const offset = (page - 1) * limit;
  const rows = await db.all(
    `SELECT sku, name, brand, color, size, mrp, price, quantity FROM products ORDER BY id DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const totalRow = await db.get(`SELECT COUNT(*) as cnt FROM products`);
  return { data: rows, total: totalRow.cnt, page, limit };
}

async function searchProducts(filters = {}, page = 1, limit = 20) {
  const db = await initDb();
  const offset = (page - 1) * limit;
  const clauses = [];
  const params = [];

  if (filters.brand) {
    clauses.push("LOWER(brand) = LOWER(?)");
    params.push(filters.brand);
  }
  if (filters.color) {
    clauses.push("LOWER(color) = LOWER(?)");
    params.push(filters.color);
  }
  if (filters.minPrice !== undefined) {
    clauses.push("price >= ?");
    params.push(filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    clauses.push("price <= ?");
    params.push(filters.maxPrice);
  }

  const where = clauses.length ? "WHERE " + clauses.join(" AND ") : "";
  const rows = await db.all(
    `SELECT sku, name, brand, color, size, mrp, price, quantity FROM products ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  const countRow = await db.get(
    `SELECT COUNT(*) as cnt FROM products ${where}`,
    params
  );
  return { data: rows, total: countRow.cnt, page, limit };
}

async function deleteAllProducts() {
  const db = await initDb();
  await db.run("DELETE FROM products");
  return true;
}

module.exports = { insertProducts, listProducts, searchProducts, deleteAllProducts };
