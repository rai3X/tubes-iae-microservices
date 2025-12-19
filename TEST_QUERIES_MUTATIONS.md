# 🧪 Test Queries & Mutations

Kumpulan query dan mutation untuk testing. Copy-paste ke GraphQL Playground di http://localhost:4000/graphql

---

## 📊 QUERIES

### 1. Get All Users
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

### 2. Get User By ID
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

### 3. Get All Products
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

### 4. Get Product By ID
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

### 5. Get All Orders
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

### 6. Get Order By ID
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

---

## ✏️ MUTATIONS

### 1. Create User
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

### 2. Create Seller
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

**⚠️ Note:** Simpan ID seller yang dihasilkan untuk membuat produk!

### 3. Delete User
```graphql
mutation {
  deleteUser(id: 1)
}
```

### 4. Create Product
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

**⚠️ Note:** 
- `seller_id` harus ID user dengan role "seller"
- `price` dan `stock` harus > 0

### 5. Update Product Stock
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

**⚠️ Note:** 
- `seller_id` harus pemilik produk
- `stock` harus >= 0

### 6. Delete Product
```graphql
mutation {
  deleteProduct(
    product_id: 1
    seller_id: 2
  )
}
```

**⚠️ Note:** `seller_id` harus pemilik produk

### 7. Create Order
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

**⚠️ Note:**
- `user_id` harus user dengan role "user" (bukan seller)
- `product_id` harus produk yang ada
- `quantity` tidak boleh melebihi stok produk
- Stok produk akan otomatis berkurang

### 8. Delete Order
```graphql
mutation {
  deleteOrder(id: 1)
}
```

---

## 🔄 Complete Flow Test

### Scenario: User Membeli Produk dari Seller

#### Step 1: Create Seller
```graphql
mutation {
  createUser(
    name: "Seller Test"
    email: "seller@test.com"
    role: "seller"
  ) {
    id
    name
    email
    role
  }
}
```
**Hasil:** `id: "2"` (contoh) - **SIMPAN ID INI!**

#### Step 2: Create User (Pembeli)
```graphql
mutation {
  createUser(
    name: "User Test"
    email: "user@test.com"
    role: "user"
  ) {
    id
    name
    email
    role
  }
}
```
**Hasil:** `id: "1"` (contoh) - **SIMPAN ID INI!**

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
**Hasil:** `id: "1"` (contoh) - **SIMPAN ID INI!**

#### Step 4: Cek Stok Awal
```graphql
query {
  product(id: 1) {
    id
    name
    stock
  }
}
```
**Hasil:** `stock: 10`

#### Step 5: User Buat Order
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
**Hasil:** Order berhasil dibuat, `total_price: 100000` (50000 × 2)

#### Step 6: Verify Stok Berkurang
```graphql
query {
  product(id: 1) {
    id
    name
    stock
  }
}
```
**Hasil:** `stock: 8` (10 - 2 = 8) ✅

#### Step 7: Lihat Order yang Dibuat
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

---

## ⚠️ Error Testing

### Test Error: Email Sudah Terdaftar
```graphql
mutation {
  createUser(
    name: "Test"
    email: "john@example.com"
    role: "user"
  ) {
    id
  }
}
```
**Expected Error:** "Email sudah terdaftar"

### Test Error: Role Tidak Valid
```graphql
mutation {
  createUser(
    name: "Test"
    email: "test@example.com"
    role: "admin"
  ) {
    id
  }
}
```
**Expected Error:** "Role tidak valid"

### Test Error: User Bukan Seller
```graphql
mutation {
  createProduct(
    name: "Test Product"
    price: 10000
    stock: 10
    seller_id: 1
  ) {
    id
  }
}
```
**Expected Error:** "User bukan seller" (jika user_id 1 adalah role "user")

### Test Error: Stok Tidak Mencukupi
```graphql
mutation {
  createOrder(
    user_id: 1
    product_id: 1
    quantity: 100
  ) {
    id
  }
}
```
**Expected Error:** "Stock tidak mencukupi" (jika stok produk < 100)

### Test Error: Seller Tidak Berhak
```graphql
mutation {
  updateProductStock(
    product_id: 1
    seller_id: 3
    stock: 50
  ) {
    id
  }
}
```
**Expected Error:** "Seller tidak berhak mengubah / menghapus produk" (jika seller_id 3 bukan pemilik produk)

---

## 📝 Tips Testing

1. **Selalu cek ID** sebelum menggunakan di mutation
2. **Simpan ID** yang dihasilkan untuk step berikutnya
3. **Test error cases** untuk memastikan validasi bekerja
4. **Verify data** setelah mutation (query lagi untuk cek)
5. **Test complete flow** dari awal sampai akhir

---

## 🎯 Quick Test Checklist

- [ ] Query: Get all users
- [ ] Mutation: Create user
- [ ] Mutation: Create seller
- [ ] Mutation: Create product (dengan seller_id)
- [ ] Query: Get all products
- [ ] Mutation: Update product stock
- [ ] Mutation: Create order
- [ ] Query: Verify stok berkurang
- [ ] Query: Get all orders
- [ ] Mutation: Delete order
- [ ] Mutation: Delete product
- [ ] Mutation: Delete user

---

**Happy Testing! 🚀**

