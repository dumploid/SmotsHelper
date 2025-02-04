const { SlashCommandBuilder } = require("discord.js");
const { isExplanationLocked, addExplanation, prepareExplanation, Explanation} = require("../../utils/mysqlUtils/explanationsUtils");
const { getVideoCount } = require("../../utils/youtubeAPI");
const { CHANNEL_ID } = require('../../../config.json');
const {userExists, addUser} = require("../../utils/mysqlUtils/userUtils");
const {escape} = require("mysql");

module.exports = {
    submitCommand: {
        data: new SlashCommandBuilder()
            .setName(`submit`)
            .setDescription(`Submit a community made explanation for a smots video`)
            .addIntegerOption((option) =>
                option.setName(`episode`)
                    .setDescription(`Which smots episode to explain?`)
            ).addStringOption((option) =>
                option.setName(`content`)
                    .setDescription(`The body of your explanation`)
            ),

        async execute(interaction) {
            await submitExplanation(interaction);
        }

    }
}

async function submitExplanation(interaction) {
    console.log(`Being called!`);
    let episode = interaction.options.get("episode").value;
    let content = interaction.options.get("content").value;

    if (episode > await getVideoCount(CHANNEL_ID)) {
        await interaction.reply("That video doesn't exist!");
        return;
    }
    if(await isExplanationLocked(episode)) {
        await interaction.reply(`🔒 The explanation for ${episode} is locked and can't be changed. 🔒`);
        return;
    }

    if (!await userExists(interaction.user.id)) {
        await addUser(interaction.user.id,
            interaction.user.username);
    }

    // TODO: ADD SUPPORT FOR USER SCORE!!

    let explanation = await prepareExplanation(
        new Explanation (escape(content), interaction.user.id, episode)
    );
    await addExplanation(explanation);

    await interaction.reply(`Explanation submitted for episode ${episode}:\n${explanation.content}`);
}