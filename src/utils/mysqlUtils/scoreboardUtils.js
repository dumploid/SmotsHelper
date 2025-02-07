const {countInstances, query} = require("./SQLutils");

async function hasScore(userID) {
    return await countInstances(`Scoreboard`, `UserID`, userID) > 0;
}

function addUserScore(userID, score) {
    let sql = `INSERT INTO Scoreboard(UserID, Score) VALUES (?, ?);`;

    return query(sql, [userID, score]);
}

function incrementScore(userID) {
    let sql = `UPDATE Scoreboard SET score = score + 1 WHERE userID = ?;`;

    return query(sql, [userID]);
}

module.exports = { hasScore, addUserScore, incrementScore };