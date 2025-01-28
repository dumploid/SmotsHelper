const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { token } = require('../config.json');
const { registerCommands } = require('./commands/commandFactory');
const { initCommandEvent } = require('./commands/commandHandler');
const { pingCommand } = require('./commands/implementations/utility/ping');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

registerCommands(client);
initCommandEvent(client);

client.login(token);