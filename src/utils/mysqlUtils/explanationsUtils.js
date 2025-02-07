const {countInstances, query} = require("./SQLutils");

class Explanation {
    constructor(content, userID, episode, locked = false) {
        this.content = content;
        this.userID = userID;
        this.episode = episode;
        this.locked = locked;
    }
}

function createExplanation(explanation) {
    let sql = `REPLACE INTO Explanations(Content, Locked, UserID, EpisodeNumber) VALUES (?, ?, ?, ?);`;

    return query(sql, [explanation.content,
        explanation.locked,
        explanation.userID,
        explanation.episode]);
}

async function getExplanation(episode) {
    let sql = `SELECT Content FROM Explanations WHERE EpisodeNumber = ${episode}`;
    return (await query(sql))[0].Content.slice(1,-1);
}

async function isExplanationLocked(episode) {
    let sql = `SELECT Locked FROM Explanations WHERE EpisodeNumber = ${episode}`;
    return (await query(sql))[0].Locked;
}

async function setLocked(episode, locked) {
    let sql = `UPDATE Explanations SET Locked = ? WHERE EpisodeNumber = ?`;
    return query(sql, [locked, episode]);
}

async function explanationExists(episode) {
    return await countInstances(`Explanations`, `EpisodeNumber`, episode) > 0;
}

module.exports = {
    createExplanation,
    getExplanation,
    isExplanationLocked,
    explanationExists,
    setLocked,
    Explanation
};