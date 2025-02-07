const { SlashCommandBuilder } = require("discord.js");
const { isExplanationLocked, createExplanation, Explanation, explanationExists} = require("../../utils/mysqlUtils/explanationsUtils");
const { videoExists} = require("../../utils/youtubeAPI");
const { userExists, addUser } = require("../../utils/mysqlUtils/userUtils");
const { escape } = require("mysql");
const { hasScore, addUserScore, incrementScore} = require("../../utils/mysqlUtils/scoreboardUtils");

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

async function handleScoreboard(userID) {
    if(!await hasScore(userID)) {
        await addUserScore(userID, 1);
        return;
    }
    await incrementScore(userID);
}

async function submitExplanation(interaction) {
    let episode = interaction.options.get("episode").value;
    let content = interaction.options.get("content").value;

    if(!await videoExists(episode)) {
        await interaction.reply("That video doesn't exist!");
        return;
    }

    if(await explanationExists(episode) && await isExplanationLocked(episode)) {
        await interaction.reply(`🔒 The explanation for ${episode} is locked and can't be changed. 🔒`);
        return;
    }

    {
        if(!await userExists(interaction.user.id)) {
            await addUser(interaction.user.id, interaction.user.username);
        }

        await handleScoreboard(interaction.user.id);
    }

    let explanation = new Explanation (escape(content), interaction.user.id, episode);
    await createExplanation(explanation);

    await interaction.reply(`Explanation submitted for episode ${episode}:\n${content}`);
}