// Run this file to migrate data from the JSON database a SQL database

const { EXPLANATIONS_FILE, SCOREBOARD_FILE } = require('../../migration_config.json');
const { createExplanation, Explanation } = require("./mysqlUtils/explanationsUtils");
const { connection, connect} = require("./mysqlUtils/SQLutils");
const { escape } = require("mysql");
const { userExists, addUser } = require("./mysqlUtils/userUtils");
const {addUserScore} = require("./mysqlUtils/scoreboardUtils");
const { readFile } = require("fs");

function transferExplanations() {
    async function transferExplanation(entry) {
        let explanation = new Explanation (
            escape(entry.content),
            entry.user.id,
            entry.episode,
            entry.locked
        );

        if (explanation.userID != null && !await userExists(explanation.userID)) {
            await addUser(
                entry.user.id,
                entry.user.name);
        }

        // smots is small enough that we don't need to use
        // a unique SQL statement to insert entries in bulk
        await createExplanation(explanation);
    }

    console.log(`Transferring explanations from ${EXPLANATIONS_FILE}`);

    return new Promise(resolve => {
        readFile(EXPLANATIONS_FILE, async function (err, data) {
            let explanations = JSON.parse(data.toString());
            for (let entry in explanations) {
                entry = explanations[entry];
                if(entry.content === "") continue;

                await transferExplanation(entry);
            }

            resolve();
            console.log(`Transferred explanations from ${EXPLANATIONS_FILE}\n`);
        });
    });
}

async function transferScoreboard() {
    console.log(`Transferring scores from ${SCOREBOARD_FILE}`);

    await readFile(SCOREBOARD_FILE, async function (err, data) {
        let scores = JSON.parse(data.toString());
        for(let entry in scores) {
            entry = scores[entry];
            await addUserScore(entry.id, entry.score);
        }
    });

    console.log(`Transferred scores from ${EXPLANATIONS_FILE}\n`);
}

async function clearDatabase() {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(`Do you want to delete all entries from the database before transferring? (recommended)\n`, answer => {
            answer = answer.toLowerCase();
            if (answer !== `y` && answer !== `yes`) {
                resolve();
                return;
            }
            console.log(`Deleting all entries in database`);

            let sql = `DELETE FROM Explanations; DELETE FROM Scoreboard; DELETE FROM Users;`;
            connection.query(sql, (err) => {
                if (err) throw (err);
                console.log(`Deleted all entries in database\n`);
                resolve();
            });
        });
    });
}

(async() => {
    await connect();

    await clearDatabase();
    await transferExplanations();
    await transferScoreboard();

    console.log(`Finished migrating DB`);
    process.exit(0);
})();