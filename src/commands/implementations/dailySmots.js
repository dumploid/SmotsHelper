const { SlashCommandBuilder } = require("discord.js");
const { getVideoCount, getLatestVideo } = require("../../utils/youtubeAPI");
const { CHANNEL_ID } = require('../../../config.json');

module.exports = {
    dailySmotsCommand: {
        data: new SlashCommandBuilder()
            .setName(`daily-smots`)
            .setDescription(`Get the latest smots video`),

        async execute(interaction) {
            let videoCount = await getVideoCount(CHANNEL_ID);
            let latestVideoURL = (await getLatestVideo(CHANNEL_ID)).url;
            await interaction.reply(`Episode:[${videoCount}](${latestVideoURL})`);
        }

    }
}