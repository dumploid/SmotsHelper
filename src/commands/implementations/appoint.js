const { SlashCommandBuilder } = require("discord.js");
const {isMod} = require("../../utils/mysqlUtils/userUtils");
const {query} = require("../../utils/mysqlUtils/SQLutils");

module.exports = {
    appointCommand: {
        data: new SlashCommandBuilder()
            .setName(`appoint`)
            .setDescription(`Appoint a user to be a mod so they can lock and unlock explanations. (Mod only)`)
            .addUserOption((option) =>
                option.setName("user")
                    .setDescription(`The user to appoint to mod.`)
            ),
        async execute(interaction) {
            await appointUser(interaction);
        }
    }
}

async function appointUser(interaction) {
    console.log(interaction.user.id);
    if(!await isMod(interaction.user.id)) {
        interaction.reply({content:"ur not a mod buckarro :joy: 🦐",ephemeral:true});
        return;
    }

    let newModID = interaction.options.get("user").value;
    if(await isMod(newModID)) {
        interaction.reply(`${newModID} is already a mod`);
        return;
    }

    let sql = `INSERT INTO Mods (UserID) VALUES (?)`;
    await query(sql, [newModID]);

    await interaction.reply(`Added <@${newModID}> to the list of mods.`);
}