# ⚡ Quick Start Guide

Panduan cepat untuk menjalankan project ini.

## 🚀 Cara Tercepat (Docker)

```bash
# 1. Clone repository
git clone <URL_REPOSITORY>
cd <NAMA_FOLDER>

# 2. Jalankan semua services
docker-compose up --build -d

# 3. Tunggu 30-60 detik, lalu buka:
# - Frontend: http://localhost:3000
# - GraphQL: http://localhost:4000/graphql
```

**Selesai!** 🎉

---

## 🧪 Quick Test

### 1. Test via Frontend (Paling Mudah)

```
1. Buka: http://localhost:3000
2. Register user baru
3. Login
4. Test fitur (lihat produk, buat order, dll)
```

### 2. Test via GraphQL Playground

```
1. Buka: http://localhost:4000/graphql
2. Copy query di bawah, paste ke panel kiri
3. Klik tombol ▶️ (Play)
```

#### Test Query - Get All Users
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

#### Test Mutation - Create User
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

---

## 🛑 Stop Services

```bash
docker-compose down
```

---

## 📖 Dokumentasi Lengkap

Lihat file **SETUP_GUIDE.md** untuk:
- Setup manual (tanpa Docker)
- Semua query & mutation lengkap
- Troubleshooting
- Complete flow test

---

**Happy Coding! 🚀**

