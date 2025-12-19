# 🚀 Panduan Setup & Running Project

## 📋 Daftar Isi
1. [Prerequisites](#prerequisites)
2. [Clone Repository](#clone-repository)
3. [Setup dengan Docker (Recommended)](#setup-dengan-docker-recommended)
4. [Setup Manual (Tanpa Docker)](#setup-manual-tanpa-docker)
5. [Cara Menjalankan](#cara-menjalankan)
6. [Testing Query & Mutation](#testing-query--mutation)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Sebelum memulai, pastikan sudah terinstall:

- **Git** - [Download Git](https://git-scm.com/downloads)
- **Node.js** (v18 atau lebih tinggi) - [Download Node.js](https://nodejs.org/)
- **Docker Desktop** (untuk cara Docker) - [Download Docker](https://www.docker.com/products/docker-desktop/)
- **MySQL** (untuk cara manual) - [Download MySQL](https://dev.mysql.com/downloads/mysql/)

**Port yang harus kosong:**
- 3000 (Frontend)
- 4000 (Gateway GraphQL)
- 4001 (User Service)
- 4002 (Product Service)
- 4003 (Order Service)
- 3307 (MySQL Database)

---

## 📥 Clone Repository

```bash
# Clone repository
git clone <URL_REPOSITORY_GITHUB>
cd <NAMA_FOLDER_REPOSITORY>

# Contoh:
# git clone https://github.com/username/tubes-iae-microservices.git
# cd tubes-iae-microservices
```

---

## 🐳 Setup dengan Docker (Recommended)

### Cara 1: Docker Compose (Paling Mudah)

```bash
# 1. Pastikan Docker Desktop sudah running

# 2. Build dan start semua services
docker-compose up --build

# Atau run di background (detached mode)
docker-compose up --build -d

# 3. Tunggu beberapa saat sampai semua container running
# Check status:
docker-compose ps

# 4. Check logs jika ada masalah:
docker-compose logs
```

### Akses Aplikasi:

- **Frontend:** http://localhost:3000
- **Gateway GraphQL:** http://localhost:4000/graphql
- **User Service:** http://localhost:4001/graphql
- **Product Service:** http://localhost:4002/graphql
- **Order Service:** http://localhost:4003/graphql

### Stop Services:

```bash
# Stop semua services
docker-compose down

# Stop dan hapus data (reset database)
docker-compose down -v
```

---

## 💻 Setup Manual (Tanpa Docker)

### Step 1: Setup Database MySQL

```bash
# 1. Start MySQL (pastikan MySQL service running)

# 2. Login ke MySQL
mysql -u root -p

# 3. Jalankan script init-db.sql
source init-db.sql
# Atau:
mysql -u root -p < init-db.sql

# 4. Verify databases dibuat
SHOW DATABASES;
# Harus ada: user_service_db, product_service_db, order_service_db
```

### Step 2: Install Dependencies

Buka **4 terminal berbeda**, lalu jalankan:

#### Terminal 1 - User Service
```bash
cd user-service
npm install
npm start
# Running di http://localhost:4001/graphql
```

#### Terminal 2 - Product Service
```bash
cd product-service
npm install
npm start
# Running di http://localhost:4002/graphql
```

#### Terminal 3 - Order Service
```bash
cd order-service
npm install
npm start
# Running di http://localhost:4003/graphql
```

#### Terminal 4 - Gateway GraphQL
```bash
cd gateway-graphql
npm install
npm start
# Running di http://localhost:4000/graphql
```

#### Terminal 5 - Frontend Service
```bash
cd frontend-service
npm install
npm start
# Running di http://localhost:3000
```

**Note:** Pastikan semua service sudah running sebelum mengakses frontend!

---

## 🎯 Cara Menjalankan

### Via Docker (Recommended)

```bash
# Start semua
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop semua
docker-compose down
```

### Via Manual

Pastikan semua service sudah running di terminal terpisah, lalu:
1. Buka browser: http://localhost:3000
2. Atau test GraphQL: http://localhost:4000/graphql

---

## 🧪 Testing Query & Mutation

### Method 1: Via GraphQL Playground (Recommended)

1. **Buka GraphQL Playground:**
   ```
   http://localhost:4000/graphql
   ```

2. **Test Query & Mutation** (copy-paste ke panel kiri, klik ▶️)

#### 📊 QUERIES

##### Get All Users
```graphql
query {
  users {
    id
    name
    email
    role
  }
}
```

##### Get User By ID
```graphql
query {
  user(id: 1) {
    id
    name
    email
    role
  }
}
```

##### Get All Products
```graphql
query {
  products {
    id
    name
    price
    stock
    seller_id
  }
}
```

##### Get Product By ID
```graphql
query {
  product(id: 1) {
    id
    name
    price
    stock
    seller_id
  }
}
```

##### Get All Orders
```graphql
query {
  orders {
    id
    user_id
    product_id
    product_name
    quantity
    price
    total_price
    created_at
  }
}
```

##### Get Order By ID
```graphql
query {
  order(id: 1) {
    id
    user_id
    product_id
    product_name
    quantity
    price
    total_price
    created_at
  }
}
```

#### ✏️ MUTATIONS

##### Create User
```graphql
mutation {
  createUser(
    name: "John Doe"
    email: "john@example.com"
    role: "user"
  ) {
    id
    name
    email
    role
  }
}
```

##### Create Seller
```graphql
mutation {
  createUser(
    name: "Seller Name"
    email: "seller@example.com"
    role: "seller"
  ) {
    id
    name
    email
    role
  }
}
```

##### Delete User
```graphql
mutation {
  deleteUser(id: 1)
}
```

##### Create Product (Seller Only)
```graphql
mutation {
  createProduct(
    name: "Kopi Arabika Premium"
    price: 75000
    stock: 50
    seller_id: 2
  ) {
    id
    name
    price
    stock
    seller_id
  }
}
```

**Note:** Pastikan `seller_id` adalah ID user dengan role "seller"!

##### Update Product Stock
```graphql
mutation {
  updateProductStock(
    product_id: 1
    seller_id: 2
    stock: 45
  ) {
    id
    name
    price
    stock
    seller_id
  }
}
```

##### Delete Product
```graphql
mutation {
  deleteProduct(
    product_id: 1
    seller_id: 2
  )
}
```

##### Create Order
```graphql
mutation {
  createOrder(
    user_id: 1
    product_id: 1
    quantity: 2
  ) {
    id
    user_id
    product_id
    product_name
    quantity
    price
    total_price
    created_at
  }
}
```

**Note:** 
- `user_id` harus user dengan role "user"
- `product_id` harus produk yang ada
- `quantity` tidak boleh melebihi stok produk

##### Delete Order
```graphql
mutation {
  deleteOrder(id: 1)
}
```

---

### Method 2: Via Frontend Web

1. **Buka:** http://localhost:3000
2. **Register User/Seller:**
   - Klik "Daftar di sini"
   - Isi form (nama, email, pilih role)
   - Auto redirect ke dashboard

3. **Login:**
   - Masukkan email
   - Auto redirect ke dashboard sesuai role

4. **Test Fitur:**
   - **User:** Lihat produk, buat order, lihat pesanan
   - **Seller:** Tambah produk, update stok, lihat pesanan masuk

---

### Method 3: Via cURL (Command Line)

```bash
# Get All Users
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { users { id name email role } }"}'

# Create User
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { createUser(name: \"Test User\", email: \"test@example.com\", role: \"user\") { id name email role } }"}'
```

---

## 📝 Complete Flow Test

### Scenario: User Membeli Produk

#### Step 1: Create Seller
```graphql
mutation {
  createUser(
    name: "Seller Test"
    email: "seller@test.com"
    role: "seller"
  ) {
    id
  }
}
```
**Simpan ID seller** (misalnya: 2)

#### Step 2: Create User
```graphql
mutation {
  createUser(
    name: "User Test"
    email: "user@test.com"
    role: "user"
  ) {
    id
  }
}
```
**Simpan ID user** (misalnya: 1)

#### Step 3: Seller Tambah Produk
```graphql
mutation {
  createProduct(
    name: "Produk Test"
    price: 50000
    stock: 10
    seller_id: 2
  ) {
    id
    name
    stock
  }
}
```
**Simpan ID product** (misalnya: 1)

#### Step 4: User Buat Order
```graphql
mutation {
  createOrder(
    user_id: 1
    product_id: 1
    quantity: 2
  ) {
    id
    product_name
    quantity
    total_price
  }
}
```

#### Step 5: Verify Stok Berkurang
```graphql
query {
  product(id: 1) {
    id
    name
    stock
  }
}
```
**Stok seharusnya berkurang dari 10 menjadi 8**

---

## 🔍 Troubleshooting

### Error: Port sudah digunakan

```bash
# Windows - Check port
netstat -ano | findstr :3000

# Linux/Mac - Check port
lsof -i :3000

# Solusi: Stop service yang menggunakan port, atau ubah port di docker-compose.yml
```

### Error: Database connection failed

**Docker:**
```bash
# Check MySQL container
docker-compose ps mysql-db

# Check logs
docker-compose logs mysql-db

# Restart database
docker-compose restart mysql-db
```

**Manual:**
```bash
# Pastikan MySQL service running
# Windows: Services > MySQL
# Linux: sudo systemctl status mysql
# Mac: brew services list
```

### Error: Service tidak bisa connect

**Docker:**
```bash
# Check semua services
docker-compose ps

# Check logs service tertentu
docker-compose logs user-service
docker-compose logs gateway-graphql

# Restart service
docker-compose restart user-service
```

**Manual:**
- Pastikan semua service sudah running
- Check URL di environment variables
- Pastikan urutan start: MySQL → Services → Gateway → Frontend

### Error: "Layanan user tidak tersedia"

- Pastikan User Service sudah running
- Check URL di environment variables
- Untuk Docker: pastikan menggunakan container name (user-service:4001)
- Untuk Manual: pastikan menggunakan localhost:4001

### Error: "Cannot return null for non-nullable field"

- Pastikan semua field yang diminta di query sudah ada di database
- Check apakah data yang di-query benar-benar ada

### Reset Database (Docker)

```bash
# Stop dan hapus semua data
docker-compose down -v

# Build ulang
docker-compose up --build -d
```

### Reset Database (Manual)

```bash
# Login MySQL
mysql -u root -p

# Drop databases
DROP DATABASE user_service_db;
DROP DATABASE product_service_db;
DROP DATABASE order_service_db;

# Jalankan init-db.sql lagi
source init-db.sql
```

---

## 📚 Referensi

- **GraphQL Playground:** http://localhost:4000/graphql
- **Frontend:** http://localhost:3000
- **Docker Docs:** https://docs.docker.com/
- **GraphQL Docs:** https://graphql.org/

---

## ✅ Checklist Setup

- [ ] Git terinstall
- [ ] Node.js terinstall (v18+)
- [ ] Docker terinstall (jika pakai Docker)
- [ ] MySQL terinstall (jika pakai manual)
- [ ] Repository sudah di-clone
- [ ] Dependencies sudah di-install
- [ ] Database sudah di-setup
- [ ] Semua service sudah running
- [ ] Bisa akses GraphQL Playground
- [ ] Bisa akses Frontend
- [ ] Test query berhasil
- [ ] Test mutation berhasil

---

**Selamat mencoba! 🎉**

Jika ada masalah, check bagian Troubleshooting atau buka issue di GitHub repository.

