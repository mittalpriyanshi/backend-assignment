# 🧩 Streamoid Backend Intern (Take-Home Assignment)

A backend system built with **Node.js**, **Express**, and **SQLite** for managing products via CSV uploads.  
Implements APIs for uploading, validating, storing, listing, and searching products.

Includes:
- Full CRUD-like endpoints (upload, list, search, delete)
- Strict validation for CSV rows
- Unit tests (Jest + Supertest)
- Dockerized setup for easy deployment

---

## ⚙️ Setup Instructions

### 1️⃣ Clone and install dependencies

``bash
git clone <your-repo-url>
cd backend-assignment
npm install

### 2️⃣ Install dependencies
npm install

### 3️⃣ Create an .env file
PORT=8000
DB_PATH=./data/products.db

### 4️⃣ Start the development server
npm run dev

Your backend will start at:
👉 http://localhost:8000/

###🧪 Running Tests

Unit and integration tests use an in-memory SQLite database.
npm test

### Test coverage includes:

Validation of CSV rows
CSV upload API behavior
Search filters and pagination

🐳 Running with Docker
Build and run using Docker Compose:
docker compose up --build
This will:
- Build the Node.js image
- Start the API server on port 8000
- Mount the local data/ directory for database persistence

- Access the API at:
👉 http://localhost:8000/

- To stop:
docker compose down

## 🧾 API Documentation

1️⃣ Health Check

GET /
Check if the server is running.

Response:

{
  "status": "ok"
}

2️⃣ Upload Products CSV

POST /upload

- Uploads a .csv file, validates each row, and stores valid products.

CSV Format:

sku,name,brand,color,size,mrp,price,quantity
P001,Classic T-Shirt,StreamThreads,Red,M,600,500,10
P002,Denim Jeans,StreamThreads,Blue,L,1200,999,5
P003,Cotton Hoodie,StreamThreads,Grey,XL,1500,1400,8


Sample Request (curl):

curl -X POST -F "file=@products.csv" http://localhost:8000/upload

Response (Success):

{
  "stored": 3,
  "failed": []
}

Response (Partial Failures):

{
  "stored": 2,
  "failed": [
    { "row": 3, "errors": ["price greater than mrp"] },
    { "row": 4, "errors": ["brand missing"] }
  ]
}

3️⃣ List All Products

GET /products

Retrieves paginated list of all stored products.

Sample Request:

curl "http://localhost:8000/products?page=1&limit=5"

Response:

{
  "data": [
    {
      "sku": "P001",
      "name": "Classic T-Shirt",
      "brand": "StreamThreads",
      "color": "Red",
      "size": "M",
      "mrp": 600,
      "price": 500,
      "quantity": 10
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 5
}

4️⃣ Search / Filter Products

GET /products/search

Searches products by brand, color, and price range. Supports pagination.

Sample Request:

curl "http://localhost:8000/products/search?brand=StreamThreads&minPrice=400&maxPrice=1000"

Response:

{
  "data": [
    {
      "sku": "P001",
      "name": "Classic T-Shirt",
      "brand": "StreamThreads",
      "color": "Red",
      "size": "M",
      "mrp": 600,
      "price": 500,
      "quantity": 10
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}

5️⃣ Delete All Products (Testing Helper)

DELETE /products

Deletes all products from the database.

Sample Request:

curl -X DELETE http://localhost:8000/products

Response:

{
  "message": "All products deleted successfully"
}

🧠 Validation Rules

During CSV upload, each row is validated as follows:

- Required fields: sku, name, brand, mrp, price
- mrp and price must be numeric and positive
- price ≤ mrp
- quantity ≥ 0 (defaults to 0 if missing)
- Duplicate SKUs (within file or DB) are rejected
- Invalid rows are reported in the "failed" array with row number and reason.

🧪 Test Examples
Run tests locally:
npm test

Example test output:
PASS  tests/validate.test.js
PASS  tests/csvUpload.test.js
PASS  tests/search.test.js

Test Suites: 3 passed, 3 total
Tests:       10 passed, 10 total


Author: Priyanshi Mittal
Developed with: ❤️ Node.js, Express, SQLite