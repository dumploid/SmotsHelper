const { YOUTUBE_KEY, CHANNEL_ID } = require("../../config.json");
const { google } = require('googleapis');

// Initialize the YouTube API client with the API key from environment variables
const youtubeAPI = google.youtube({
    version: 'v3',
    auth: YOUTUBE_KEY // as stored in config.json
});

// Function to get the latest video posted on the channel
async function getLatestVideo() {
    try {
        const response = await youtubeAPI.channels.list({
            part: 'contentDetails',
            id: CHANNEL_ID,
        });

        const playlistID = response.data.items[0].contentDetails.relatedPlaylists.uploads;

        // Retrieve the latest video from the upload playlist
        const latestVideoResponse = await youtubeAPI.playlistItems.list({
            part: 'snippet',
            playlistId: playlistID,
            maxResults: 1, // Only get the latest video
        });

        const latestVideo = latestVideoResponse.data.items[0].snippet;
        return {
            title: latestVideo.title,
            videoId: latestVideo.resourceId.videoId,
            url: `https://www.youtube.com/watch?v=${latestVideo.resourceId.videoId}`,
        };
    } catch (err) {
        console.error('Error fetching the latest video:', err);
    }
}

// Function to get the nth oldest video ever posted on the channel
async function getNthVideo(n) {
    try {
        let videos = [];
        let nextPageToken = null;
        const response = await youtubeAPI.channels.list({
            part: 'contentDetails',
            id: CHANNEL_ID,
        });

        const playlistId = response.data.items[0].contentDetails.relatedPlaylists.uploads;

        // Loop to fetch all videos using pagination
        while (true) {
            const playlistItemsRes = await youtubeAPI.playlistItems.list({
                part: 'snippet',
                playlistId: playlistId,
                maxResults: 50, // Max allowed by the API
                pageToken: nextPageToken, // Add the nextPageToken for subsequent requests
            });

            // Collect the videos from the current batch
            videos = videos.concat(playlistItemsRes.data.items);

            // Check if there is a next page
            nextPageToken = playlistItemsRes.data.nextPageToken;

            // Break the loop if there are no more pages
            if (!nextPageToken) break;
        }

        // Sort the videos by published date (oldest first)
        videos.sort((a, b) => new Date(a.snippet.publishedAt) - new Date(b.snippet.publishedAt));

        if (n <= videos.length) {
            const nthVideo = videos[n - 1].snippet; // Get nth oldest video (1-indexed)
            return {
                title: nthVideo.title,
                videoId: nthVideo.resourceId.videoId,
                url: `https://www.youtube.com/watch?v=${nthVideo.resourceId.videoId}`,
            };
        } else {
            console.error('Requested video index is out of range');
        }
    } catch (err) {
        console.error('Error fetching the nth video:', err);
    }
}

// Function to get the number of videos on the channel
async function getVideoCount() {
    try {
        const res = await youtubeAPI.channels.list({
            part: 'contentDetails',
            id: CHANNEL_ID,
        });

        const playlistId = res.data.items[0].contentDetails.relatedPlaylists.uploads;
        let totalVideos = 0;
        let nextPageToken = null;

        // Loop to count all videos using pagination
        while (true) {
            const playlistItemsRes = await youtubeAPI.playlistItems.list({
                part: 'snippet',
                playlistId: playlistId,
                maxResults: 50, // Max allowed by the API
                pageToken: nextPageToken, // Add the nextPageToken for subsequent requests
            });

            // Add the number of videos in the current batch
            totalVideos += playlistItemsRes.data.items.length;

            // Check if there is a next page
            nextPageToken = playlistItemsRes.data.nextPageToken;

            // Break the loop if there are no more pages
            if (!nextPageToken) break;
        }

        return totalVideos;
    } catch (err) {
        console.error('Error fetching the video count:', err);
    }
}
// Function to get a comment from a specified user on a specified video
async function getCommentsByUser(videoId, username) {
    try {
        let nextPageToken = null;
        const userComments = [];

        // Loop to fetch all comments using pagination
        while (true) {
            const commentsRes = await youtubeAPI.commentThreads.list({
                part: 'snippet',
                videoId: videoId,
                maxResults: 100, // Max allowed by the API for commentThreads.list
                pageToken: nextPageToken,
            });

            // Check comments in the current batch
            for (const thread of commentsRes.data.items) {
                const topComment = thread.snippet.topLevelComment.snippet;

                // Match the display name of the comment author
                if (topComment.authorDisplayName === username) {
                    userComments.push({
                        author: topComment.authorDisplayName,
                        comment: topComment.textDisplay,
                        likeCount: topComment.likeCount,
                        publishedAt: topComment.publishedAt,
                        updatedAt: topComment.updatedAt,
                    });
                }
            }

            // Get the next page token
            nextPageToken = commentsRes.data.nextPageToken;

            // Break the loop if no more pages are available
            if (!nextPageToken) break;
        }

        // Return all comments made by the user
        if (userComments.length === 0)
            console.log(`No comments by user "${username}" found on video ID "${videoId}".`);
        return userComments;
    } catch (err) {
        console.error('Error fetching comments:', err);
    }
}

async function videoExists(episode) {
    return episode <= await getVideoCount() && episode > 0;
}

module.exports = {
    getLatestVideo,
    getNthVideo,
    getVideoCount,
    getCommentsByUser,
    videoExists,
};