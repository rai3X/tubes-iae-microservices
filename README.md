# 🛍️ E-Commerce Microservices - GraphQL API dengan Docker

Aplikasi e-commerce berbasis microservices menggunakan GraphQL API dan Docker. Sistem ini terdiri dari beberapa service yang saling terhubung untuk mengelola user, produk, dan pesanan.

## 📋 Deskripsi Project

Project ini adalah implementasi sistem e-commerce dengan arsitektur microservices yang terdiri dari:

1. **User Service** - Mengelola data user (pembeli dan penjual)
2. **Product Service** - Mengelola data produk dengan validasi seller
3. **Order Service** - Mengelola pesanan dengan validasi user dan produk, serta auto-update stok
4. **Gateway GraphQL** - Single entry point untuk semua service
5. **Frontend Service** - Web interface dengan autentikasi dan dashboard terpisah untuk user dan seller
6. **MySQL Database** - Database untuk menyimpan data

### Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│              Frontend Service (Port 3000)               │
│         Node.js + Express + EJS + Session Auth           │
└────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│           Gateway GraphQL (Port 4000)                   │
│         Single Entry Point - Aggregates Services        │
└─────┬───────────┬───────────┬───────────┬───────────────┘
      │           │           │           │
      ▼           ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  User    │ │ Product  │ │  Order   │ │   MySQL  │
│ Service  │ │ Service  │ │ Service  │ │ Database │
│  :4001   │ │  :4002   │ │  :4003   │ │   :3307  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

## 🚀 Cara Menjalankan

### Prerequisites

- Docker & Docker Compose terinstall
- Port 3000, 4000, 4001, 4002, 4003, 3307 tidak digunakan

### Run dengan Docker (Recommended)

```bash
# Build dan start semua services
docker-compose up --build

# Atau run di background
docker-compose up --build -d

# Stop semua services
docker-compose down

# Stop dan hapus data (reset database)
docker-compose down -v
```

### Run Local (Tanpa Docker)

#### Backend Services

```bash
# 1. Start MySQL (atau gunakan MySQL lokal)
# 2. Setup database (jalankan init-db.sql)

# 3. Start User Service
cd user-service
npm install
npm start
# Running di http://localhost:4001

# 4. Start Product Service (terminal baru)
cd product-service
npm install
npm start
# Running di http://localhost:4002

# 5. Start Order Service (terminal baru)
cd order-service
npm install
npm start
# Running di http://localhost:4003

# 6. Start Gateway (terminal baru)
cd gateway-graphql
npm install
npm start
# Running di http://localhost:4000
```

#### Frontend Service

```bash
cd frontend-service
npm install
npm start
# Running di http://localhost:3000
```

## 📍 Port Mapping

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Frontend** | 3000 | http://localhost:3000 | Web interface |
| **Gateway** | 4000 | http://localhost:4000/graphql | GraphQL Gateway |
| **User Service** | 4001 | http://localhost:4001/graphql | User management |
| **Product Service** | 4002 | http://localhost:4002/graphql | Product management |
| **Order Service** | 4003 | http://localhost:4003/graphql | Order management |
| **MySQL** | 3307 | localhost:3307 | Database |

## 🎯 Fitur Aplikasi

### 👤 User Service
- ✅ Get semua user
- ✅ Get user by ID
- ✅ Create user baru (role: user/seller)
- ✅ Delete user
- ✅ Validasi email duplikat
- ✅ Validasi role

### 📦 Product Service
- ✅ Get semua produk
- ✅ Get produk by ID
- ✅ Create produk (khusus seller)
- ✅ Update stok produk
- ✅ Delete produk
- ✅ Validasi seller
- ✅ Validasi hak seller atas produk

### 🛒 Order Service
- ✅ Get semua order
- ✅ Get order by ID
- ✅ Create order baru
- ✅ Delete order
- ✅ Auto validasi user (role = "user")
- ✅ Auto validasi produk
- ✅ Auto cek stok
- ✅ Auto kurangi stok
- ✅ Auto rollback stok jika gagal

### 🌐 Gateway GraphQL
- ✅ Single entry point
- ✅ Agregasi semua service
- ✅ Error propagation
- ✅ CORS enabled

### 🖥️ Frontend Service
- ✅ Login dengan email
- ✅ Register user/seller
- ✅ Session-based authentication
- ✅ Dashboard User (lihat produk, buat order, lihat pesanan)
- ✅ Dashboard Seller (kelola produk, lihat pesanan masuk)

## 📝 Query & Mutation

### User Service

#### Query: Get All Users
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

#### Query: Get User By ID
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

#### Mutation: Create User
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

#### Mutation: Delete User
```graphql
mutation {
  deleteUser(id: 1)
}
```

### Product Service

#### Query: Get All Products
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

#### Query: Get Product By ID
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

#### Mutation: Create Product
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

#### Mutation: Update Product Stock
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

#### Mutation: Delete Product
```graphql
mutation {
  deleteProduct(
    product_id: 1
    seller_id: 2
  )
}
```

### Order Service

#### Query: Get All Orders
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

#### Query: Get Order By ID
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

#### Mutation: Create Order
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

#### Mutation: Delete Order
```graphql
mutation {
  deleteOrder(id: 1)
}
```

## 🧪 Testing

### Test via GraphQL Playground

1. **Buka Gateway Playground:**
   ```
   http://localhost:4000/graphql
   ```

2. **Test Query:**
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

3. **Test Mutation:**
   ```graphql
   mutation {
     createUser(
       name: "Test User"
       email: "test@example.com"
       role: "user"
     ) {
       id
       name
       email
       role
     }
   }
   ```

### Test via Frontend

1. **Buka Frontend:**
   ```
   http://localhost:3000
   ```

2. **Register User:**
   - Klik "Daftar di sini"
   - Isi form register
   - Pilih role (user/seller)
   - Auto redirect ke dashboard

3. **Login:**
   - Masukkan email
   - Auto redirect ke dashboard sesuai role

4. **Test Fitur:**
   - **User:** Lihat produk, buat order, lihat pesanan
   - **Seller:** Tambah produk, update stok, lihat pesanan masuk

## 🔄 Complete Flow Test

### Scenario: User Membeli Produk

1. **Register Seller:**
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
   Note: Simpan ID seller (misalnya: 2)

2. **Register User:**
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
   Note: Simpan ID user (misalnya: 1)

3. **Seller Tambah Produk:**
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
   Note: Simpan ID product (misalnya: 1)

4. **User Buat Order:**
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

5. **Verify Stok Berkurang:**
   ```graphql
   query {
     product(id: 1) {
       id
       name
       stock
     }
   }
   ```
   Stok seharusnya berkurang dari 10 menjadi 8

## 📁 Struktur Project

```
TUBES IAE/
├── README.md                 # Dokumentasi ini
├── docker-compose.yml        # Docker compose configuration
├── init-db.sql              # Database initialization script
├── run.bat                  # Script run untuk Windows
├── run.sh                   # Script run untuk Linux/Mac
│
├── user-service/            # User Service
│   ├── Dockerfile
│   ├── package.json
│   ├── index.js
│   ├── schema.js
│   ├── resolvers.js
│   └── db.js
│
├── product-service/         # Product Service
│   ├── Dockerfile
│   ├── package.json
│   ├── index.js
│   ├── schema.js
│   ├── resolvers.js
│   └── db.js
│
├── order-service/           # Order Service
│   ├── Dockerfile
│   ├── package.json
│   ├── index.js
│   ├── schema.js
│   ├── resolvers.js
│   └── db.js
│
├── gateway-graphql/         # Gateway GraphQL
│   ├── Dockerfile
│   ├── package.json
│   ├── index.js
│   ├── schema.js
│   └── resolvers.js
│
└── frontend-service/        # Frontend Service
    ├── Dockerfile
    ├── package.json
    ├── server.js
    ├── views/
    │   ├── login.ejs
    │   ├── register.ejs
    │   ├── dashboard-user.ejs
    │   └── dashboard-seller.ejs
    └── public/
        └── css/
            └── style.css
```

## 🗄️ Database Schema

### user_service_db.users
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR(255))
- email (VARCHAR(255), UNIQUE)
- role (ENUM('user', 'seller'))
- created_at (TIMESTAMP)
```

### product_service_db.products
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR(255))
- price (DECIMAL(10,2))
- stock (INT)
- seller_id (INT)
- created_at (TIMESTAMP)
```

### order_service_db.orders
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- user_id (INT)
- product_id (INT)
- product_name (VARCHAR(255))
- quantity (INT)
- price (DECIMAL(10,2))
- total_price (DECIMAL(10,2))
- created_at (TIMESTAMP)
```

## 🔐 Autentikasi & Authorization

### Frontend Authentication
- **Session-based** menggunakan express-session
- **Login:** Email-based (tanpa password untuk simplicity)
- **Auto redirect** berdasarkan role setelah login
- **Protected routes** dengan middleware

### Service Authorization
- **Product Service:** Validasi seller via User Service
- **Order Service:** Validasi user role dan produk via User & Product Service
- **Role-based access:** User hanya bisa order, Seller hanya bisa kelola produk

## ⚠️ Error Handling

### User Service Errors
- Email sudah terdaftar
- Role tidak valid
- User tidak ditemukan
- Database error / koneksi DB gagal

### Product Service Errors
- User bukan seller
- Produk tidak ditemukan
- Seller tidak berhak mengubah / menghapus produk
- Stok atau harga tidak valid
- Layanan user tidak tersedia
- Database error

### Order Service Errors
- User bukan role user
- Produk tidak ditemukan
- Stok tidak mencukupi
- Quantity tidak valid
- Layanan user / produk tidak tersedia
- Gagal create order (rollback dijalankan)
- Database error

### Gateway Errors
- Downstream service tidak aktif
- Error validasi dari service lain
- Query / mutation tidak valid

## 🛠️ Technology Stack

- **Backend:** Node.js, Express, GraphQL
- **Database:** MySQL 8.0
- **Frontend:** Node.js, Express, EJS
- **Containerization:** Docker, Docker Compose
- **Session:** express-session
- **HTTP Client:** Axios

## 📊 Arsitektur Microservices

### Service Communication
- **Gateway ↔ Services:** HTTP REST (GraphQL over HTTP)
- **Service ↔ Service:** HTTP REST (GraphQL over HTTP)
- **Service ↔ Database:** MySQL Connection
- **Network:** Docker bridge network (`microservices-network`)

### Data Flow
1. Client → Frontend Service (Port 3000)
2. Frontend → Gateway GraphQL (Port 4000)
3. Gateway → User/Product/Order Service (Port 4001/4002/4003)
4. Service → MySQL Database (Port 3307)
5. Response kembali ke client

## 🚦 Quick Start Commands

```bash
# Start semua services
docker-compose up --build -d

# Stop semua services
docker-compose down

# View logs
docker-compose logs

# View logs service tertentu
docker-compose logs frontend-service
docker-compose logs gateway-graphql

# Restart service
docker-compose restart frontend-service

# Check status
docker-compose ps
```

## 🎨 Frontend Features

### User Dashboard
- ✅ Daftar produk dengan tombol beli
- ✅ Form order dengan quantity
- ✅ Daftar pesanan sendiri
- ✅ Hapus pesanan
- ✅ Auto refresh setelah order

### Seller Dashboard
- ✅ Form tambah produk baru
- ✅ Daftar produk milik seller
- ✅ Update stok produk
- ✅ Hapus produk
- ✅ Daftar pesanan masuk untuk produk seller

## 📝 Notes

- **Database:** Menggunakan 3 database terpisah (user_service_db, product_service_db, order_service_db) untuk isolasi data
- **Session:** Frontend menggunakan session-based auth (24 jam expiry)
- **CORS:** Gateway sudah dikonfigurasi untuk allow CORS
- **Error Messages:** Semua error messages sudah disesuaikan dengan spesifikasi

## 🔍 Troubleshooting

### Port sudah digunakan
```bash
# Check port
netstat -ano | findstr :3000

# Atau ubah port di docker-compose.yml
```

### Service tidak bisa connect
```bash
# Check semua services running
docker-compose ps

# Check logs
docker-compose logs [service-name]
```

### Database error
```bash
# Reset database
docker-compose down -v
docker-compose up --build -d
```

## 📚 Referensi

- GraphQL: https://graphql.org/
- Docker: https://docs.docker.com/
- Express: https://expressjs.com/
- EJS: https://ejs.co/

---

**Dibuat untuk Tugas Besar Integrasi Aplikasi Enterprise**  
**Semester 5 - Sistem Informasi**

