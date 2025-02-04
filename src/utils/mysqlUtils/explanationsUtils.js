const {connection} = require("./SQLutils");

class Explanation {
    constructor(content, userID, episode, locked = false) {
        this.content = content;
        this.userID = userID;
        this.episode = episode;
        this.locked = locked;
    }
}

async function addExplanation(explanation) {
    let sql = `REPLACE INTO Explanations(Content, Locked, UserID, EpisodeNumber) VALUES (?, ?, ?, ?);`;

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
    });
}

async function isExplanationLocked(episode) {
    let sql = `SELECT Locked FROM Explanations WHERE EpisodeNumber = ${episode}`;

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, data) => {
            if(err) reject(err);
            resolve(data[0].Locked);
        });
    });
}

async function explanationExists(episode) {
    let sql = `SELECT COUNT(*) AS count FROM Explanations WHERE EpisodeNumber = ?;`;

    return new Promise((resolve, reject) => {
        connection.query(sql, [episode], (err, data) => {
            if(err) reject(err);
            resolve(data[0].count > 0);
        });
    })
}

function prepareExplanation(explanation) {
    if(explanation.content === "") explanation.content = null;
    if(explanation.userID === "N/A") explanation.userID = null;
    return explanation;
}

module.exports = { addExplanation,
    getExplanation,
    isExplanationLocked,
    prepareExplanation,
    explanationExists,
    Explanation
};