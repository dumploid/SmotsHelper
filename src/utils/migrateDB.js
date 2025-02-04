// Run this file to migrate data from the JSON database a SQL database

const { EXPLANATIONS_FILE } = require('../../migration_config.json');
const { readFile } = require("fs");
const { addExplanation, prepareExplanation, Explanation } = require("./mysqlUtils/explanationsUtils");
const { connection } = require("./mysqlUtils/SQLutils");
const { escape } = require("mysql");
const { userExists, addUser } = require("./mysqlUtils/userUtils");

async function transferExplanations() {
    async function transferExplanation(entry) {
        let explanation = prepareExplanation(new Explanation (
            escape(entry.content),
            entry.user.id,
            entry.episode,
            entry.locked)
        );

        if (explanation.userID != null && !await userExists(explanation.userID)) {
            await addUser(
                entry.user.id,
                entry.user.name);
        }

        // smots is small enough that we don't need to use
        // a unique SQL statement to insert entries in bulk
        await addExplanation(explanation);
    }

    console.log(`Transferring explanations from ${EXPLANATIONS_FILE}`);

    await readFile(EXPLANATIONS_FILE, async function (err, data) {
        let explanations = JSON.parse(data.toString());
        for (let entry in explanations) {
            entry = explanations[entry];
            if(entry.content === "") continue;

            await transferExplanation(entry);
        }
    });

}
connection.connect(function (err) {
    if (err) throw err;
    console.log('Connected to DB');
});

transferExplanations(connection);