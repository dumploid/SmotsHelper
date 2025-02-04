const { SlashCommandBuilder } = require("discord.js");
const { CHANNEL_ID } = require('../../../config.json');
const { getVideoCount } = require("../../utils/youtubeAPI");
const { getExplanation } = require("../../utils/mysqlUtils/explanationsUtils");

module.exports = {
    explainCommand: {
        data: new SlashCommandBuilder()
            .setName(`explain`)
            .setDescription(`Get a community made explanation for a smots video`)
            .addIntegerOption((option) =>
                option.setName(`episode`)
                    .setDescription(`Which smots episode to explain?`)
            ),

        async execute(interaction) {
            await explainEpisode(interaction);
        }
    }
}

async function explainEpisode(interaction) {
    let episode = interaction.options.get('episode').value;
    if (episode > await getVideoCount(CHANNEL_ID)) {
        await interaction.reply("That video doesn't exist!");
        return;
    }

    let explanation = await getExplanation(episode);
    await interaction.reply(explanation === "" ?
        `No explanation for episode ${episode}`:
        `Episode ${episode}:\n${explanation}`
    );
}