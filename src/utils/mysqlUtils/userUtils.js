const {connection, countInstances} = require("./SQLutils");

async function addUser(userID, username) {
    let sql = `INSERT INTO Users(UserID, Username) VALUES (?, ?);`

    await connection.query(sql, [userID, username], (err) => {
        if (err) throw err;
    });
}

async function userExists(userID) {
    return await countInstances(`Users`, `UserID`, userID) > 0;
}

module.exports = { userExists, addUser };