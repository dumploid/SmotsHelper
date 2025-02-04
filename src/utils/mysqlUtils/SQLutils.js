const mysql = require('mysql')
const { SQL_HOST, SQL_USER, SQL_PASSWORD, SQL_DATABASE } = require('../../../config.json')

const connection = module.exports = mysql.createConnection({
    host: SQL_HOST,
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    charset: 'utf8mb4', // allows emojis to be stored
    multipleStatements: true
});

function connect() {
    return new Promise(resolve => {
        connection.connect(function (err) {
            if (err) throw err;
            console.log('Connected to DB');
            resolve();
        });
    });
}

function countInstances(table, column, value) {
    let sql = `SELECT COUNT(*) AS count FROM ${table} WHERE ${column} = ?;`;

    return new Promise((resolve, reject) => {
        connection.query(sql, [value], (err, data) => {
            if(err) reject(err);
            resolve(data[0].count);
        });
    });
}

function getRows(table) {
    let sql = `SELECT COUNT(*) AS count FROM ${table};`;

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, data) => {
            if(err) reject(err);
            resolve(data[0].count);
        });
    });
}

module.exports = { connection, countInstances, connect, getRows };