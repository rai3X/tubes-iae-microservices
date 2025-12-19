const db = require("./db");
const axios = require("axios");

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:4001/graphql";

const resolvers = {

  products: () =>
    new Promise((resolve, reject) => {
      db.query("SELECT * FROM products", (err, results) => {
        if (err) return reject(new Error("Database error"));
        resolve(results);
      });
    }),

  product: ({ id }) =>
    new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM products WHERE id = ?",
        [id],
        (err, results) => {
          if (err) return reject(new Error("Database error"));
          resolve(results[0] || null);
        }
      );
    }),

  createProduct: async ({ name, price, stock, seller_id }) => {
    if (price <= 0 || stock < 0) {
      throw new Error("Stok atau harga tidak valid");
    }

    let user;
    try {
      const response = await axios.post(USER_SERVICE_URL, {
        query: `
          query {
            user(id: ${seller_id}) {
              id
              role
            }
          }
        `
      });

      if (response.data.errors) throw new Error();
      user = response.data.data.user;
    } catch {
      throw new Error("Layanan user tidak tersedia");
    }

    if (!user || user.role !== "seller") {
      throw new Error("User bukan seller");
    }

    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO products (name, price, stock, seller_id) VALUES (?, ?, ?, ?)",
        [name, price, stock, seller_id],
        (err, result) => {
          if (err) return reject(new Error("Database error"));
          resolve({ id: result.insertId, name, price, stock, seller_id });
        }
      );
    });
  },

  updateProductStock: async ({ product_id, seller_id, stock }) => {
    if (stock < 0) {
      throw new Error("Stock tidak valid");
    }

    let user;
    try {
      const response = await axios.post(USER_SERVICE_URL, {
        query: `
          query {
            user(id: ${seller_id}) {
              id
              role
            }
          }
        `
      });

      if (response.data.errors) throw new Error();
      user = response.data.data.user;
    } catch {
      throw new Error("Layanan user tidak tersedia");
    }

    if (!user || user.role !== "seller") {
      throw new Error("User bukan seller");
    }

    return new Promise((resolve, reject) => {
      db.query(
        "SELECT id FROM products WHERE id = ? AND seller_id = ?",
        [product_id, seller_id],
        (err, result) => {
          if (err) return reject(new Error("Database error"));
          if (!result.length) {
            return reject(new Error("Seller tidak berhak mengubah / menghapus produk"));
          }

          db.query(
            "UPDATE products SET stock = ? WHERE id = ?",
            [stock, product_id],
            (err) => {
              if (err) return reject(new Error("Database error"));

              db.query(
                "SELECT id, name, price, stock, seller_id FROM products WHERE id = ?",
                [product_id],
                (err, results) => {
                  if (err) {
                    return reject(new Error("Database error"));
                  }
                  if (!results || results.length === 0) {
                    return reject(new Error("Produk tidak ditemukan"));
                  }
                  const product = results[0];
                  const formattedProduct = {
                    id: product.id ? String(product.id) : null,
                    name: product.name || "",
                    price: product.price ? Number(product.price) : 0,
                    stock: product.stock ? Number(product.stock) : 0,
                    seller_id: product.seller_id ? Number(product.seller_id) : 0
                  };
                  
                  if (!formattedProduct.name) {
                    return reject(new Error("Data produk tidak valid"));
                  }
                  
                  resolve(formattedProduct);
                }
              );
            }
          );
        }
      );
    });
  },

  deleteProduct: async ({ product_id, seller_id }) => {
    let user;
    try {
      const response = await axios.post(USER_SERVICE_URL, {
        query: `
          query {
            user(id: ${seller_id}) {
              id
              role
            }
          }
        `
      });

      if (response.data.errors) throw new Error();
      user = response.data.data.user;
    } catch {
      throw new Error("Layanan user tidak tersedia");
    }

    if (!user || user.role !== "seller") {
      throw new Error("User bukan seller");
    }

    return new Promise((resolve, reject) => {
      db.query(
        "SELECT id FROM products WHERE id = ? AND seller_id = ?",
        [product_id, seller_id],
        (err, result) => {
          if (err) return reject(new Error("Database error"));
          if (!result.length) {
            return reject(new Error("Seller tidak berhak mengubah / menghapus produk"));
          }

          db.query(
            "DELETE FROM products WHERE id = ?",
            [product_id],
            (err) => {
              if (err) return reject(new Error("Database error"));
              resolve("Produk berhasil dihapus");
            }
          );
        }
      );
    });
  }
};

module.exports = resolvers;
