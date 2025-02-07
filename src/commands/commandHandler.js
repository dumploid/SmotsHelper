const { Events, MessageFlags } = require('discord.js');

function initiateCommand(command, registeredCommands) {
    if(command === undefined) throw new Error(`Command must not be undefined`);
    if(command.data === undefined) throw new Error(`A provided command is missing data`);
    if(command.execute === undefined) console.log(`${command.data.name} does not have an execute function.`);
    registeredCommands.set(command.data.name, command);
}

function initCommandEvent(client) {
    client.on(Events.InteractionCreate, async interaction => {
        if(!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `There was an error while executing this command!`, flags: MessageFlags.Ephemeral });
        }
    });
}

module.exports = {initiateCommand, initCommandEvent};