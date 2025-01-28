const { SlashCommandBuilder } = require("discord.js");
const { CHANNEL_ID } = require('../../../config.json');
const { getVideoCount, getNthVideo} = require("../../utils/youtubeAPI");
const {getRandomInt} = require("../../utils/utils");

module.exports = {
    randomSmotsCommand: {
        data: new SlashCommandBuilder()
            .setName(`random-smots`)
            .setDescription(`Get a random smots video`),

        async execute(interaction) {
            let randomVideoID = getRandomInt(1, await getVideoCount(CHANNEL_ID));
            let randomVideoURL = (await getNthVideo(CHANNEL_ID, randomVideoID)).url;
            let message = (`Episode:[${randomVideoID}](${randomVideoURL})`);
            await interaction.reply(message);
        }
    }
}