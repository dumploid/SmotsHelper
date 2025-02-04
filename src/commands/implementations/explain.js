const { SlashCommandBuilder } = require("discord.js");
const { videoExists } = require("../../utils/youtubeAPI");
const { getExplanation, explanationExists } = require("../../utils/mysqlUtils/explanationsUtils");

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
    if (!await videoExists(episode)) {
        await interaction.reply("That video doesn't exist!");
        return;
    }

    await interaction.reply(await explanationExists(episode) ?
        `Episode ${episode}:\n${await getExplanation(episode)}`:
        `No explanation for episode ${episode}`
    );
}