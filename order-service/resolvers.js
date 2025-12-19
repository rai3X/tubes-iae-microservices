const db = require("./db");
const axios = require("axios");

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:4001/graphql";

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:4002/graphql";

const resolvers = {

  orders: () =>
    new Promise((resolve, reject) => {
      db.query("SELECT * FROM orders", (err, results) => {
        if (err) return reject(new Error("Database error"));
        resolve(results);
      });
    }),

  order: ({ id }) =>
    new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM orders WHERE id = ?",
        [id],
        (err, results) => {
          if (err) return reject(new Error("Database error"));
          resolve(results[0] || null);
        }
      );
    }),

  createOrder: async ({ user_id, product_id, quantity }) => {
    if (quantity <= 0) {
      throw new Error("Quantity tidak valid");
    }

    let user;
    try {
      const userResponse = await axios.post(USER_SERVICE_URL, {
        query: `
          query {
            user(id: ${user_id}) {
              id
              role
            }
          }
        `
      });

      if (userResponse.data.errors) throw new Error();
      user = userResponse.data.data.user;
    } catch {
      throw new Error("Layanan user sedang tidak tersedia");
    }

    if (!user || user.role !== "user") {
      throw new Error("User bukan role user");
    }

    let product;
    try {
      const productResponse = await axios.post(PRODUCT_SERVICE_URL, {
        query: `
          query {
            product(id: ${product_id}) {
              id
              name
              price
              stock
              seller_id
            }
          }
        `
      });

      if (productResponse.data.errors) throw new Error();
      product = productResponse.data.data.product;
    } catch {
      throw new Error("Layanan produk sedang tidak tersedia");
    }

    if (!product) {
      throw new Error("Produk tidak ditemukan");
    }

    if (product.stock < quantity) {
      throw new Error("Stock tidak mencukupi");
    }

    const total_price = product.price * quantity;
    let stockUpdated = false;

    try {
      await axios.post(PRODUCT_SERVICE_URL, {
        query: `
          mutation {
            updateProductStock(
              product_id: ${product_id}
              seller_id: ${product.seller_id}
              stock: ${product.stock - quantity}
            ) {
              id
            }
          }
        `
      });

      stockUpdated = true;

      return await new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO orders
          (user_id, product_id, product_name, quantity, price, total_price)
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            user_id,
            product_id,
            product.name,
            quantity,
            product.price,
            total_price
          ],
          (err, result) => {
            if (err) return reject(new Error("Database error"));

            resolve({
              id: result.insertId,
              user_id,
              product_id,
              product_name: product.name,
              quantity,
              price: product.price,
              total_price,
              created_at: new Date().toISOString()
            });
          }
        );
      });

    } catch (error) {
      if (stockUpdated) {
        await axios.post(PRODUCT_SERVICE_URL, {
          query: `
            mutation {
              updateProductStock(
                product_id: ${product_id}
                seller_id: ${product.seller_id}
                stock: ${product.stock}
              ) {
                id
              }
            }
          `
        });
      }

      throw new Error("Gagal create order (rollback dijalankan)");
    }
  },

  deleteOrder: ({ id }) =>
    new Promise((resolve, reject) => {
      db.query(
        "SELECT id FROM orders WHERE id = ?",
        [id],
        (err, result) => {
          if (err) return reject(new Error("Database error"));
          if (result.length === 0) {
            return reject(new Error("Order tidak ditemukan"));
          }

          db.query(
            "DELETE FROM orders WHERE id = ?",
            [id],
            (err) => {
              if (err) return reject(new Error("Database error"));
              resolve("Order berhasil dihapus");
            }
          );
        }
      );
    })
};

module.exports = resolvers;
