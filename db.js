const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
});

db.connect((err) => {
    if (err) {
        console.log("Error connecting database", err);
        return;
    }
    console.log("Connected to Database");
});

module.exports = db;