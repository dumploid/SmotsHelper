const {countInstances, query} = require("./SQLutils");

function addUser(userID, username) {
    let sql = `INSERT INTO Users(UserID, Username) VALUES (?, ?);`

    return query(sql, [userID, username]);
}

async function userExists(userID) {
    return await countInstances(`Users`, `UserID`, userID) > 0;
}

module.exports = { userExists, addUser };