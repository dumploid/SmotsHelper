const { SlashCommandBuilder } = require("discord.js");
const {countInstances, getRows} = require("../../utils/mysqlUtils/SQLutils");
const {getVideoCount} = require("../../utils/youtubeAPI");
const {hearts} = require("../../assets/miscValues.json");
const {getRandomElement} = require("../../utils/utils");

module.exports = {
    progressCommand: {
        data: new SlashCommandBuilder()
            .setName(`progress`)
            .setDescription(`Tells you the percentage of videos we've explained.`),

        async execute(interaction) {
            await displayProgress(interaction);
        }
    }
}

async function displayProgress(interaction) {
    let videoAmount = await getVideoCount();
    let lockedAmount = await countInstances(`Explanations`, `Locked`, true);
    let filled = await getRows(`Explanations`);

    let randomHeart = getRandomElement(hearts);

    interaction.reply(
        `We have locked explanations for ${lockedAmount}/${videoAmount} ` +
        `or about ${Math.round((lockedAmount / videoAmount) * 100)}% ` +
        `and filled out explanations for ` + `${filled}/${videoAmount} ` +
        `or about ${Math.round((filled / videoAmount) * 100)}% of videos! ${randomHeart}`
    );
}