const { SlashCommandBuilder } = require("discord.js");
const {getVideoCount, getNthVideo} = require("../../utils/youtubeAPI");
const {query} = require("../../utils/mysqlUtils/SQLutils");
const {getRandomElement} = require("../../utils/utils");

module.exports = {
    whatToDoCommand: {
        data: new SlashCommandBuilder()
            .setName(`whatdoido`)
            .setDescription(`Gets a random video with an empty explanation.`),
        async execute(interaction) {
            let videoCount = await getVideoCount();
            // Get a list of numbers, 1 to videoCount (inclusive)
            let allVideos = Array.from(Array(videoCount).keys()).map((x) => x+1);

            let sql = `SELECT EpisodeNumber From Explanations`;
            let explainedVideos = (await query(sql)).map((x) => x.EpisodeNumber);

            let unexplainedVideos = allVideos.filter((video) => !explainedVideos.includes(video));
            let unexplainedVideo = getRandomElement(unexplainedVideos);
            let videoURL = (await getNthVideo(unexplainedVideo)).url;

            interaction.reply(`Not sure what to do? How about you help by explaining this video!\n` +
                `Use /submit [[${unexplainedVideo}](${videoURL})] and write an explanation for the video.`);
        }
    }
}