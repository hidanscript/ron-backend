const mysql = require('mysql');
const { promisify } = require("util");
const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if(err) console.error(err);
    if(connection) connection.release();
    return;
});

// Promisify pool queries
pool.query = promisify(pool.query);

module.exports = pool;