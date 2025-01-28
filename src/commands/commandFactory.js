const {initiateCommand} = require("./commandHandler");
const {pingCommand} = require("./implementations/utility/ping");

function registerCommands(client) {
    initiateCommand(client, pingCommand);
}

module.exports = {registerCommands};