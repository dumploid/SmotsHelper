/*
[IMPORTANT]
run this file to deploy commands
this file should not be referenced otherwise
 */
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('../config.json');
const {registerCommands} = require("./commands/commandFactory");

//collect the commands, then map them to their needed JSON format
const commandJSON = registerCommands().map(x=>x.data.toJSON());
// construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// deploy commands
(async () => {
    try {
        console.log(`Started refreshing ${commandJSON.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commandJSON },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // catch and log errors
        console.error(error);
    }
})();