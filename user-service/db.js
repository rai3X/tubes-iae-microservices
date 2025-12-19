const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "user_service_db"
});

db.connect(err => {
  if (err) {
    console.error("❌ User DB Error:", err.message);
  } else {
    console.log("✅ User Service DB Connected");
  }
});

module.exports = db;
