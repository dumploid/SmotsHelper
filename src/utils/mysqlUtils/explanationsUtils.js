const {connection, countInstances} = require("./SQLutils");

class Explanation {
    constructor(content, userID, episode, locked = false) {
        this.content = content;
        this.userID = userID;
        this.episode = episode;
        this.locked = locked;
    }
}

async function createExplanation(explanation) {
    let sql = `REPLACE INTO Explanations(Content, Locked, UserID, EpisodeNumber) VALUES (?, ?, ?, ?);`;

    // Parameterized queries are preferred and reduce chance for SQL injections
    await connection.query(sql, [explanation.content,
        explanation.locked,
        explanation.userID,
        explanation.episode], (err) => {
        if (err) throw err;
    });
}

function getExplanation(episode) {
    let sql = `SELECT Content FROM Explanations WHERE EpisodeNumber = ${episode}`;

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, data) => {
            if(err) reject(err);
            let returnedData = data[0].Content.slice(1,-1);
            resolve(returnedData);
        });
    });
}

function isExplanationLocked(episode) {
    let sql = `SELECT Locked FROM Explanations WHERE EpisodeNumber = ${episode}`;

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, data) => {
            if(err) reject(err);
            resolve(data[0].Locked);
        });
    });
}

async function explanationExists(episode) {
    return await countInstances(`Explanations`, `EpisodeNumber`, episode) > 0;
}

module.exports = {
    createExplanation,
    getExplanation,
    isExplanationLocked,
    explanationExists,
    Explanation
};