const { SlashCommandBuilder } = require("discord.js");
const {connection} = require("../../utils/mysqlUtils/SQLutils");
const {getVideoCount} = require("../../utils/youtubeAPI");

module.exports = {
    remainingCommand: {
        data: new SlashCommandBuilder()
            .setName(`remaining`)
            .setDescription(`Tells you the how many videos are left to be explained.`)
            .addBooleanOption((option) =>
                option.setName("send-list")
                .setDescription(`Will DM you a list of all the smots gaming episodes yet to be explained.`)
            ),
        async execute(interaction) {
            await reportRemaining(interaction);
        }
    }
}

async function reportRemaining(interaction) {
    let videoCount = await getVideoCount();
    // Get a list of numbers, 1 to videoCount (inclusive)
    let allVideos = Array.from(Array(videoCount).keys()).map((x) => x+1);

    let sql = `SELECT EpisodeNumber From Explanations WHERE Locked = True;`;

    let lockedVideos = await new Promise((resolve, reject) => {
        connection.query(sql, (err, data) => {
            if(err) reject(err);
            resolve(data.map((x) => x.EpisodeNumber));
        });
    });

    let unlockedVideos = allVideos.filter((video) => !lockedVideos.includes(video));
    interaction.reply(`We have ${unlockedVideos.length} remaining videos to explain!`);

    if(interaction.options.get("send-list")) {
        interaction.user.send("Remaining Videos:\n```" + unlockedVideos.join(", ") + "```");
    }
}