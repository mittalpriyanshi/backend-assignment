const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../server");
const { initDb } = require("../db");
const { deleteAllProducts } = require("../models/productModel");

const fixtures = path.join(__dirname, "fixtures");

beforeAll(async () => {
  process.env.DB_PATH = ":memory:";
  await initDb();
});

afterEach(async () => {
  await deleteAllProducts();
});

test("upload valid CSV stores products", async () => {
  const res = await request(app)
    .post("/upload")
    .attach("file", path.join(fixtures, "products.csv"));
  expect(res.status).toBe(200);
  expect(res.body.stored).toBe(3);
  expect(res.body.failed.length).toBe(0);
});

test("upload invalid CSV reports failures and duplicates", async () => {
  const res = await request(app)
    .post("/upload")
    .attach("file", path.join(fixtures, "products_invalid.csv"));
  expect(res.status).toBe(200);
  expect(res.body.stored).toBe(1);
  expect(res.body.failed.length).toBeGreaterThanOrEqual(2);
});
