const { SlashCommandBuilder } = require("discord.js");
const { CHANNEL_ID } = require('../../../config.json');
const { getNthVideo, videoExists } = require("../../utils/youtubeAPI");

module.exports = {
    smotsCommand: {
        data: new SlashCommandBuilder()
            .setName(`smots`)
            .setDescription(`Get a smots episode of your choosing`)
            .addIntegerOption((option) =>
                option.setName(`episode`)
                    .setDescription(`Which smots episode to view?`)
            ),

        async execute(interaction) {
            await getSmotsEpisode(interaction);
        }

    }
}

async function getSmotsEpisode(interaction) {
    let episode = interaction.options.get("episode").value;

    if (!await videoExists(episode)) {
        await interaction.reply("That video doesn't exist!");
        return;
    }

    let retrievedVideoURL = (await getNthVideo(CHANNEL_ID, episode)).url;
    await interaction.reply(`Episode:[${episode}](${retrievedVideoURL})`);
}