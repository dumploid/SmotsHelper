const {initiateCommand} = require("./commandHandler");
// there probably is a better way to import these ?
const {pingCommand} = require("./implementations/ping");
const {smonsoleCommand} = require("./implementations/smonsole");
const {smotsCommand} = require("./implementations/smots");
const {dailySmotsCommand} = require("./implementations/dailySmots");
const {randomSmotsCommand} = require("./implementations/randomSmots");

const {Collection} = require("discord.js");

function registerCommands() {
    let registeredCommands = new Collection();
    let commands = [pingCommand, smonsoleCommand, smotsCommand, dailySmotsCommand, randomSmotsCommand];

    for (let command of commands) {
        initiateCommand(command, registeredCommands);
    }

    return registeredCommands;
}

module.exports = {registerCommands};