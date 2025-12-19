# 🌐 UTS Project Based - Microservice Architecture

### Mata Kuliah: Integrasi Aplikasi Enterprise  
### Dosen Pengampu: HLZ 
### Anggota Kelompok:  
1. Arjuna Dwi Putra Kunaefi (102022300152)  
2. Raihan Tri Darma (102022300242)  
3. Rara Lianisyah (102022300216)  
4. Valerina Sherin (102022330089)

### Kelompok: 8  
### Kelas: SI-47-01  

---

## 📦 Daftar Service

1. **User Service**  
   - **Port:** `4001`  
   - **GraphQL Endpoint:** [http://localhost:4001/graphql](http://localhost:4001/graphql)  
   - **Fungsi:** Mengelola data pengguna dan seller (CRUD User/Seller)  
   - **Relasi:**  
     - Digunakan oleh Product Service untuk memvalidasi seller  
     - Digunakan oleh Order Service untuk memvalidasi user  

2. **Product Service**  
   - **Port:** `4002`  
   - **GraphQL Endpoint:** [http://localhost:4002/graphql](http://localhost:4002/graphql)  
   - **Fungsi:** Mengelola data produk (CRUD Produk, validasi seller, update stok produk setelah order)  
   - **Relasi:**  
     - Terhubung ke User Service (verifikasi sellerId)  
     - Terhubung ke Order Service (cek stok produk sebelum membuat order)  

3. **Order Service**  
   - **Port:** `4003`  
   - **GraphQL Endpoint:** [http://localhost:4003/graphql](http://localhost:4003/graphql)  
   - **Fungsi:** Mengelola pesanan user (membuat order, melihat daftar order per user dan per produk)  
   - **Relasi:**  
     - Meminta data dari User Service (validasi userId)  
     - Meminta data dari Product Service (cek stok produk)  

4. **Gateway GraphQL**  
   - **Port:** `4000`  
   - **GraphQL Endpoint:** [http://localhost:4000/graphql](http://localhost:4000/graphql)  
   - **Fungsi:** Single entry point untuk semua service, agregasi query/mutation  
   - **Relasi:** Menghubungkan semua service (User, Product, Order)

5. **Frontend Service**  
   - **Port:** `3000`  
   - **Akses Browser:** [http://localhost:3000](http://localhost:3000)  
   - **Fitur Utama:**  
     - Login dan Registrasi User/Seller  
     - Dashboard User: Melihat produk, membuat pesanan, melihat daftar pesanan  
     - Dashboard Seller: Menambah, mengedit, menghapus produk, melihat pesanan produk miliknya  
   - **Relasi:** Menghubungkan seluruh service melalui Gateway GraphQL

---

## 🧩 Relasi Antar Service

| Source Service | Target Service | Deskripsi Komunikasi |
|----------------|----------------|----------------------|
| **Product Service** | **User Service** | Memverifikasi apakah seller valid sebelum menambah produk |
| **Order Service** | **User Service** | Memverifikasi apakah user valid sebelum membuat order |
| **Order Service** | **Product Service** | Mengecek stok produk sebelum pesanan dibuat |
| **Frontend Service** | **Semua Service** | Menjadi penghubung utama (client gateway) melalui REST API |

---

## 🚀 Cara Menjalankan Aplikasi

### ⚡ Quick Start (Docker - Recommended)

```bash
# Clone repository
git clone <URL_REPOSITORY>
cd <NAMA_FOLDER>

# Jalankan semua services dengan Docker
docker-compose up --build -d

# Akses aplikasi:
# - Frontend: http://localhost:3000
# - GraphQL Playground: http://localhost:4000/graphql
```

**Lihat [QUICK_START.md](QUICK_START.md) untuk panduan cepat!**

### 📖 Dokumentasi Lengkap

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Panduan setup lengkap (Docker & Manual)
- **[QUICK_START.md](QUICK_START.md)** - Panduan cepat untuk mulai
- **Testing Query & Mutation** - Lihat di SETUP_GUIDE.md bagian "Testing Query & Mutation"

### 💻 Manual Setup (Tanpa Docker)

```bash
# 1. Setup Database MySQL
mysql -u root -p < init-db.sql

# 2. Install dependencies & run setiap service di terminal terpisah:

# Terminal 1 - User Service
cd user-service
npm install
npm start

# Terminal 2 - Product Service  
cd product-service
npm install
npm start

# Terminal 3 - Order Service
cd order-service
npm install
npm start

# Terminal 4 - Gateway GraphQL
cd gateway-graphql
npm install
npm start

# Terminal 5 - Frontend Service
cd frontend-service
npm install
npm start
```

**Untuk detail lengkap, lihat [SETUP_GUIDE.md](SETUP_GUIDE.md)**

---