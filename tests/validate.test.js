const { validateRow } = require("../utils/validate");

test("valid row returns valid cleaned object", () => {
  const row = { sku: "P01", name: "Item", brand: "B", mrp: "100", price: "90", quantity: "2" };
  const { valid, errors, cleaned } = validateRow(row);
  expect(valid).toBe(true);
  expect(errors.length).toBe(0);
  expect(cleaned.sku).toBe("P01");
  expect(cleaned.mrp).toBe(100);
  expect(cleaned.price).toBe(90);
  expect(cleaned.quantity).toBe(2);
});

test("missing required fields are reported", () => {
  const row = { sku: "", name: " ", brand: "", mrp: "", price: "" };
  const { valid, errors } = validateRow(row);
  expect(valid).toBe(false);
  expect(errors).toEqual(expect.arrayContaining(["sku missing", "brand missing", "mrp missing", "price missing"]));
});

test("price greater than mrp reported", () => {
  const row = { sku: "p", name: "n", brand: "b", mrp: "100", price: "200" };
  const { valid, errors } = validateRow(row);
  expect(valid).toBe(false);
  expect(errors).toEqual(expect.arrayContaining(["price greater than mrp"]));
});
