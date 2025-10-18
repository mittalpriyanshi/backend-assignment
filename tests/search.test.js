const { initDb } = require("../db");
const { insertProducts, searchProducts } = require("../models/productModel");

beforeAll(async () => {
  process.env.DB_PATH = ":memory:";
  await initDb();
});

test("search filters by brand and price range", async () => {
  const products = [
    { sku: "S1", name: "A", brand: "X", color: "Red", size: "M", mrp: 100, price: 80, quantity: 1 },
    { sku: "S2", name: "B", brand: "X", color: "Blue", size: "L", mrp: 200, price: 180, quantity: 1 },
    { sku: "S3", name: "C", brand: "Y", color: "Red", size: "S", mrp: 300, price: 250, quantity: 1 }
  ];
  await insertProducts(products);
  const res1 = await searchProducts({ brand: "X" }, 1, 10);
  expect(res1.total).toBe(2);
  const res2 = await searchProducts({ color: "red", minPrice: 90 }, 1, 10);
  expect(res2.total).toBe(1);
});
