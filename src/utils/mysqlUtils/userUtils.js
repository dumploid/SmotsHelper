const {connection} = require("./SQLutils");

async function addUser(userID, username) {
    let sql = `INSERT INTO Users(UserID, Username) VALUES (?, ?);`

    await connection.query(sql, [userID, username], (err) => {
        if (err) throw err;
    });
}

async function userExists(userID) {
    let sql = `SELECT COUNT(*) AS count FROM Users WHERE UserID = ?;`;

    return new Promise((resolve, reject) => {
        connection.query(sql, [userID], (err, data) => {
            if(err) reject(err);
            resolve(data[0].count > 0);
        });
    })
}

module.exports = { userExists, addUser };