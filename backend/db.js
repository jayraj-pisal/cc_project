const mysql = require('mysql2/promise');

// Use MYSQL_URL if provided (e.g. mysql://user:pass@host:3306/dbname)
// otherwise fall back to individual MYSQL* vars
const pool = process.env.MYSQL_URL
  ? mysql.createPool(process.env.MYSQL_URL)
  : mysql.createPool({
      host: process.env.MYSQLHOST || 'localhost',
      user: process.env.MYSQLUSER || 'root',
      password: process.env.MYSQLPASSWORD || '',
      database: process.env.MYSQLDATABASE || 'pdf_form_app',
      port: process.env.MYSQLPORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
    });

module.exports = pool;
