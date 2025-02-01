const { Client, Events, IntentsBitField} = require('discord.js');
const { token } = require('../config.json');
const { registerCommands } = require('./commands/commandFactory');
const { initCommandEvent } = require('./commands/commandHandler');

const { connection} = require('./utils/SQLutils');

setupClient();
connection.connect(function (err) {
    if (err) throw err;
    console.log('Connected to DB');
});

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