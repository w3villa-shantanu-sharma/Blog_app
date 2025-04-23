const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',            // Your MySQL username
  password: 'villa@8171',  // Your MySQL password
  database: 'blog_app',      // Your MySQL database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Example check function
async function check() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("Connected to MySQL");

    const [db] = await connection.query('SELECT DATABASE() AS db');
    console.log("Connected to database:", db[0].db);

    const [rows] = await connection.query('SELECT * FROM users');
    console.log("First row:", rows[0]);
  } catch (err) {
    console.error("DB Connection Error:", err);
  } finally {
    if (connection) connection.release();
    console.log("Connection released");
  }
}

check();

module.exports = pool;
