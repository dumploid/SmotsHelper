const { SlashCommandBuilder } = require("discord.js");
const { getVideoCount, getLatestVideo } = require("../../utils/youtubeAPI");

module.exports = {
    dailySmotsCommand: {
        data: new SlashCommandBuilder()
            .setName(`daily-smots`)
            .setDescription(`Get the latest smots video`),

        async execute(interaction) {
            let videoCount = await getVideoCount();
            let latestVideoURL = (await getLatestVideo()).url;
            await interaction.reply(`Episode:[${videoCount}](${latestVideoURL})`);
        }

    }
}