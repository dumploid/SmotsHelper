const { Client, Events, IntentsBitField} = require('discord.js');
const { token } = require('../config.json');
const { registerCommands } = require('./commands/commandFactory');
const { initCommandEvent } = require('./commands/commandHandler');

setupClient();

function setupClient() {
    let client = new Client({ intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent]
    });

    client.once(Events.ClientReady, readyClient => {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    client.login(token);

    setupCommands(client);

    return client;
}

function setupCommands(client) {
    client.commands = registerCommands();
    initCommandEvent(client);
}