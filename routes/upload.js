const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const { validateRow } = require("../utils/validate");
const { insertProducts } = require("../models/productModel");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "file required" });

  const filePath = path.resolve(req.file.path);
  const validProducts = [];
  const failed = [];
  let rowNum = 0;
  const seenSkus = new Set();

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
        .on("data", (row) => {
          rowNum++;
          const { valid, errors, cleaned } = validateRow(row);
          if (!valid) {
            failed.push({ row: rowNum, errors });
            return;
          }
          if (seenSkus.has(cleaned.sku)) {
            failed.push({ row: rowNum, errors: ["duplicate sku in file"] });
            return;
          }
          seenSkus.add(cleaned.sku);
          validProducts.push(cleaned);
        })
        .on("end", () => resolve())
        .on("error", (err) => reject(err));
    });

    const stored = validProducts.length ? await insertProducts(validProducts) : 0;

    res.json({ stored, failed });
  } catch (err) {
    res.status(500).json({ error: "internal_error", detail: String(err) });
  } finally {
    fs.unlink(filePath, () => {});
  }
});

module.exports = router;
