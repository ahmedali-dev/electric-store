import mysql from 'mysql2/promise';

console.log('from connection ', process.env.DB_DATA);

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_DATA,
  password: process.env.DB_PASS,
});

export default connection