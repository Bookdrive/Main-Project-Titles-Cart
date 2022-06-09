const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'haider',
    password: "Haider@@",
    database: 'test'
});
module.exports = pool;