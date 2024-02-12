const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'employee_database',
  password: '123456'
});

async function getUser(username) {
  const [rows] = await pool.execute(
    `SELECT * 
      FROM users 
      WHERE username = ?`,
    [username]
  );

  return rows[0];
}

async function createUser(username, password) {
  const [result] = await pool.execute(
    `INSERT INTO users (username, password) 
      VALUES (?, ?)`,
    [username, password]
  );

  return result.insertId;
}

module.exports = { getUser, createUser };
