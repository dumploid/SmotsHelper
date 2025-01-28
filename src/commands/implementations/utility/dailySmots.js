const { SlashCommandBuilder } = require("discord.js");
const { CHANNEL_ID } = require('../../../../config.json');
const { getVideoCount, getLatestVideo } = require("../../../assets/youtubeAPI");

module.exports = {
    dailySmotsCommand: {
        data: new SlashCommandBuilder()
            .setName(`daily-smots`)
            .setDescription(`Get a random smots video`),

        async execute(interaction) {
            await getVideoCount(CHANNEL_ID).then((count) => {
                getLatestVideo(CHANNEL_ID).then((video) => {
                    interaction.reply(`Episode:[${count}](${video.url})`);
                })
            });
        }

    }
}