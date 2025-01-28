const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    smonsoleCommand: {
        data: new SlashCommandBuilder()
            .setName(`smonsole`)
            .setDescription(`Runs something through smonsole`)
            .addStringOption(option =>
                option.setName("command")
                .setDescription("run command")),
        async execute(interaction) {
            await interaction.reply(`You ran: ${interaction.options.getString("command")}`);
        }
    }
}