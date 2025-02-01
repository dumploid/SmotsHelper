const { EXPLANATIONS_FILE } = require('../../migration_config.json');
const { readFile } = require("fs");
const { addExplanation } = require("./explanationsUtils");
const { connection } = require("./SQLutils");
const { escape } = require("mysql");

async function transferExplanations() {
    function prepareExplanation(explanation) {
        if(explanation.content === "") explanation.content = null;
        if(explanation.userID === "N/A") explanation.userID = null;
        return explanation;
    }

    console.log(`Transferring explanations from ${EXPLANATIONS_FILE}`);

    await readFile(EXPLANATIONS_FILE, function (err, data) {
        let explanations = JSON.parse(data.toString());
        for(let entry in explanations) {
            entry = explanations[entry];

            let explanation = prepareExplanation({
                content: escape(entry.content),
                userID: entry.user.id,
                locked: entry.locked,
                episode: entry.episode,
            });

            // smots is small enough that we don't need to use
            // a unique SQL statement to insert entries in bulk
            addExplanation(explanation);
        }
    });

}
connection.connect(function (err) {
    if (err) throw err;
    console.log('Connected to DB');
});
transferExplanations(connection);