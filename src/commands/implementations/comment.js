const { SlashCommandBuilder } = require("discord.js");
const {getNthVideo, getCommentsByUser} = require("../../utils/youtubeAPI");
const { CHANNEL_ID } = require('../../../config.json');

module.exports = {
    commentCommand: {
        data: new SlashCommandBuilder()
            .setName(`comment`)
            .setDescription(`Get a comment from a specified user on a smots episode`)
            .addIntegerOption((option) =>
                option.setName(`episode`)
                    .setDescription(`Which smots episode to look for comments on?`))
            .addStringOption((option) =>
                option.setName(`user`)
                    .setDescription(`Which user to get comments from? This is case-sensitive. (Type their username not display name)`)),
        async execute(interaction) {
            await getComment(interaction);
        }
    }
}

function getArguments(interaction) {
    let user = interaction.options.get(`user`).value;
    let episode = interaction.options.get(`episode`).value;

    if(!user.startsWith("@")){user = "@"+user;}
    return {user, episode};
}

function formatComments(comments) {
    //put comments in non-reversed order
    comments = comments.reverse();

    //format comments
    let commentsFormatted = ``;
    comments.forEach((comment, index) => {
        commentsFormatted += `\n\n`;
        commentsFormatted += `Comment ${index+1}:\n`;
        commentsFormatted += comment;
    });

    //account for characters which don't directly translate over from YT
    return commentsFormatted.replaceAll("<br>","\n")
        .replaceAll("&quot;","\"")
        .replaceAll("&#39;","\'");
}

async function getComment(interaction) {
    let {user, episode} = getArguments(interaction);

    let nthVideo = await getNthVideo(CHANNEL_ID, episode);
    let comments = (await getCommentsByUser(nthVideo.videoId, user)).map(x=>x.comment);

    if (comments.length === 0){
        await interaction.reply({content:`No such comments`, ephemeral:true});
        return;
    }

    let formattedComments = formatComments(comments);

    interaction.reply(`Comments by user ${user} on episode ${episode}:` + formattedComments);
}