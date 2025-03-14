const {initiateCommand} = require("./commandHandler");

// there probably is a better way to import these ?
const {pingCommand} = require("./implementations/ping");
const {smonsoleCommand} = require("./implementations/smonsole");
const {smotsCommand} = require("./implementations/smots");
const {dailySmotsCommand} = require("./implementations/dailySmots");
const {randomSmotsCommand} = require("./implementations/randomSmots");
const {commentCommand} = require("./implementations/comment");
const {explainCommand} = require("./implementations/explain");
const {submitCommand} = require("./implementations/submit");
const {progressCommand} = require("./implementations/progress");
const {remainingCommand} = require("./implementations/remaining");
const {lockCommand} = require("./implementations/lock");
const {appointCommand} = require("./implementations/appoint");
const {whatToDoCommand} = require("./implementations/whatdoido");

const {Collection} = require("discord.js");

function registerCommands() {
    let registeredCommands = new Collection();
    let commands = [
        pingCommand,       smonsoleCommand,    smotsCommand,
        dailySmotsCommand, randomSmotsCommand, commentCommand,
        explainCommand,    submitCommand,      progressCommand,
        remainingCommand, lockCommand, appointCommand,
        whatToDoCommand
    ];

    for (let command of commands) {
        initiateCommand(command, registeredCommands);
    }

    return registeredCommands;
}

module.exports = {registerCommands};