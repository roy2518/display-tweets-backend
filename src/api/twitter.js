require('dotenv').config();
const fetch = require('node-fetch');
const querystring = require('querystring');

const TWITTER_ENDPOINT = 'https://api.twitter.com/2/tweets/search/recent';

// Retrieve recent tweets containing a given `hashtag`
const getTweets = async (hashtag) => {
    const queryParams = {
        // hashtag to search for
        query: `#${hashtag}`,
        // number of tweets to fetch
        max_results: 40,
        // tweet fields we want to receive
        'tweet.fields': 'created_at,text',
        // get user info
        expansions: 'author_id',
        // user fields we want to retrieve
        'user.fields': 'name,username,profile_image_url,location',
    };
    const params = `?${querystring.stringify(queryParams)}`;
    const urlWithParams = `${TWITTER_ENDPOINT}${params}`;
    const response = await fetch(urlWithParams, { headers: { Authorization: `Bearer ${process.env.TWITTER_API_KEY}` } });
    return response.json();
};

module.exports = {
    getTweets
};