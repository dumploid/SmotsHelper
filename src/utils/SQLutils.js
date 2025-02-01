const mysql = require('mysql')
const { SQL_HOST, SQL_USER, SQL_PASSWORD, SQL_DATABASE } = require('../../config')

const connection = module.exports = mysql.createConnection({
    host: SQL_HOST,
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    charset: 'utf8mb4'
});

module.exports = { connection };