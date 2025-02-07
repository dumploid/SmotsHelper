const { SlashCommandBuilder } = require("discord.js");
const {videoExists} = require("../../utils/youtubeAPI");
const {setLocked} = require("../../utils/mysqlUtils/explanationsUtils");
const {isMod} = require("../../utils/mysqlUtils/userUtils");

module.exports = {
    lockCommand: {
        data: new SlashCommandBuilder()
            .setName(`lock`)
            .setDescription(`Lock or unlock an explanation so it cant be changed (Mod only)`)
            .addIntegerOption((option) =>
                option.setName(`episode`)
                    .setDescription(`Which smots episode to lock explanations for?`)
            ).addBooleanOption((option) =>
                option.setName(`locked`)
                    .setDescription(`Lock or unlock this explanation? (True to lock, False to unlock)`)
            ),

        async execute(interaction) {
            await handleLockCommand(interaction);
        }
    }
}

async function handleLockCommand(interaction) {
    let episode = interaction.options.get("episode").value;
    let lockValue = interaction.options.get("locked").value;

    let userID = interaction.user.id;

    if(await isMod(userID)) {
        interaction.reply({content:"ur not a mod buckarro :joy: 🦐",ephemeral:true});
        return;
    }
    if(!await videoExists(episode)) {
        interaction.reply(`That video doesn't exist!`);
        return;
    }

    await setLocked(episode, lockValue);

    let lockMessage = lockValue ? `locked` : `unlocked`;
    interaction.reply(`Explanation ${lockMessage} for episode ${episode}!`);
}