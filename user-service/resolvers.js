const db = require("./db");

const resolvers = {

  users: () =>
    new Promise((resolve, reject) => {
      db.query("SELECT * FROM users", (err, results) => {
        if (err) return reject(new Error("Database error / koneksi DB gagal"));
        resolve(results);
      });
    }),

  user: ({ id }) =>
    new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE id = ?",
        [id],
        (err, results) => {
          if (err) return reject(new Error("Database error / koneksi DB gagal"));
          resolve(results[0] || null);
        }
      );
    }),

  createUser: ({ name, email, role }) =>
    new Promise((resolve, reject) => {
      if (!["user", "seller"].includes(role)) {
        return reject(new Error("Role tidak valid"));
      }

      db.query(
        "SELECT id FROM users WHERE email = ?",
        [email],
        (err, result) => {
          if (err) return reject(new Error("Database error / koneksi DB gagal"));
          if (result.length > 0) {
            return reject(new Error("Email sudah terdaftar"));
          }

          db.query(
            "INSERT INTO users (name, email, role) VALUES (?, ?, ?)",
            [name, email, role],
            (err, result) => {
              if (err) return reject(new Error("Database error / koneksi DB gagal"));
              resolve({
                id: result.insertId,
                name,
                email,
                role
              });
            }
          );
        }
      );
    }),

  deleteUser: ({ id }) =>
    new Promise((resolve, reject) => {
      db.query(
        "SELECT id FROM users WHERE id = ?",
        [id],
        (err, result) => {
          if (err) return reject(new Error("Database error / koneksi DB gagal"));
          if (result.length === 0) {
            return reject(new Error("User tidak ditemukan"));
          }

          db.query(
            "DELETE FROM users WHERE id = ?",
            [id],
            (err) => {
              if (err) return reject(new Error("Database error / koneksi DB gagal"));
              resolve("User berhasil dihapus");
            }
          );
        }
      );
    })
};

module.exports = resolvers;
