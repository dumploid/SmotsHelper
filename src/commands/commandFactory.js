const {initiateCommand} = require("./commandHandler");

const {pingCommand} = require("./implementations/utility/ping");
const {smonsoleCommand} = require("./implementations/utility/smonsole");
const {smotsCommand} = require("./implementations/utility/smots");
const {dailySmotsCommand} = require("./implementations/utility/dailySmots");

const {Collection} = require("discord.js");

function registerCommands() {
    let registeredCommands = new Collection();
    let commands = [pingCommand, smonsoleCommand, smotsCommand, dailySmotsCommand];

    for (let command of commands) {
        initiateCommand(command, registeredCommands);
    }

    return registeredCommands;
}

module.exports = {registerCommands};