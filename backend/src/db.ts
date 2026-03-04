import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let pool: mysql.Pool;

export const initMySQL = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DB || 'crystallized_iron',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Check connection
    const connection = await pool.getConnection();
    console.log('[MySQL] Database Connected.');

    // Auto-create basic tables for testing if not exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS characters (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        level INT DEFAULT 1,
        hp INT DEFAULT 100,
        mp INT DEFAULT 50,
        map_id VARCHAR(255),
        pos_x FLOAT DEFAULT 0,
        pos_y FLOAT DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    connection.release();
  } catch (err) {
    console.error('[MySQL] Database initialization failed: ', err);
  }
};

export const getDB = () => pool;
