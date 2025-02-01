const {connection} = require("./SQLutils");

async function addExplanation(explanation) {
    let sql = `INSERT INTO Explanations(Content, Locked, UserID, EpisodeNumber) VALUES (?, ?, ?, ?);`;

    // Parameterized queries are preferred and reduce chance for SQL injections
    await connection.query(sql, [explanation.content,
        explanation.locked,
        explanation.userID,
        explanation.episode], (err) => {
        if (err) throw err;
    });
}

async function getExplanation(episode) {
    let sql = `SELECT Content FROM Explanations WHERE EpisodeNumber = ${episode}`;

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, data) => {
            if(err) reject(err);
            let returnedData = data[0].Content.slice(1,-1);
            resolve(returnedData);
        });
    })
}

module.exports = { addExplanation, getExplanation };