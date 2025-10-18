const express = require("express");
const path = require("path");
require("dotenv").config();
const uploadRouter = require("./routes/upload");
const productsRouter = require("./routes/products");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", uploadRouter);
app.use("/", productsRouter);
app.get("/", (req, res) => res.json({ status: "ok" }));

if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
