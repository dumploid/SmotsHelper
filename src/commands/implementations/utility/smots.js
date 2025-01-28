const { SlashCommandBuilder } = require("discord.js");
const { CHANNEL_ID } = require('../../../../config.json');
const { getVideoCount, getNthVideo } = require("../../../assets/youtubeAPI");

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
            let episode = interaction.options.get("episode");

            await getVideoCount(CHANNEL_ID).then((count) => {
                if (episode.value > count || episode.value < 0) {
                    interaction.reply("That video doesn't exist!");
                    return;
                }

                getNthVideo(CHANNEL_ID, episode.value).then((video) => {
                    interaction.reply(`Episode:[ ${episode.value}](${video.url})`);
                });
            })
        }

    }
}