const {connection, countInstances} = require("./SQLutils");

async function hasScore(userID) {
    return await countInstances(`Scoreboard`, `UserID`, userID) > 0;
}

async function addUserScore(userID, score) {
    let sql = `INSERT INTO Scoreboard(UserID, Score) VALUES (?, ?);`;

    await connection.query(sql, [userID, score], (err) => {
       if (err) { throw err; }
    });
}

async function incrementScore(userID) {
    let sql = `UPDATE Scoreboard SET score = score + 1 WHERE userID = ?;`;

    await connection.query(sql, [userID], (err) => {
        if (err) throw err;
    });
}

module.exports = { hasScore, addUserScore, incrementScore };