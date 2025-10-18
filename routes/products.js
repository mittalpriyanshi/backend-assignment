const express = require("express");
const { listProducts, searchProducts, deleteAllProducts } = require("../models/productModel");

const router = express.Router();

function toIntOrDefault(v, def) {
  const x = parseInt(v);
  return isNaN(x) ? def : x;
}

router.get("/products", async (req, res) => {
  const page = toIntOrDefault(req.query.page, 1);
  const limit = toIntOrDefault(req.query.limit, 20);
  try {
    const result = await listProducts(page, limit);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "internal_error", detail: String(err) });
  }
});

router.get("/products/search", async (req, res) => {
  const page = toIntOrDefault(req.query.page, 1);
  const limit = toIntOrDefault(req.query.limit, 20);
  const filters = {};
  if (req.query.brand) filters.brand = req.query.brand;
  if (req.query.color) filters.color = req.query.color;
  if (req.query.minPrice !== undefined) {
    const v = Number(req.query.minPrice);
    if (!isNaN(v)) filters.minPrice = v;
  }
  if (req.query.maxPrice !== undefined) {
    const v = Number(req.query.maxPrice);
    if (!isNaN(v)) filters.maxPrice = v;
  }
  try {
    const result = await searchProducts(filters, page, limit);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "internal_error", detail: String(err) });
  }
});

router.delete("/products", async (req, res) => {
  try {
    await deleteAllProducts();
    res.json({ message: "All products deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "internal_error", detail: String(err) });
  }
});

module.exports = router;
