require('dotenv').config();
const fetch = require('node-fetch');
const querystring = require('querystring');

const TWITTER_ENDPOINT = 'https://api.twitter.com/2/tweets/search/recent';

// Retrieve recent tweets containing a given `hashtag`.
// `nextToken` is optional and used to fetch the next
// page of results.
const getTweets = async (hashtag, nextToken) => {
  const queryParams = {
    // hashtag to search for
    query: `#${hashtag} -is:retweet lang:en`,
    // number of tweets to fetch
    max_results: 40,
    // tweet fields we want to receive
    'tweet.fields': 'created_at,text,entities',
    // get user info
    expansions: 'author_id',
    // user fields we want to retrieve
    'user.fields': 'name,username,profile_image_url,location',
  };
  if (nextToken) {
    queryParams.next_token = nextToken;
  }
  const params = `?${querystring.stringify(queryParams)}`;
  const urlWithParams = `${TWITTER_ENDPOINT}${params}`;
  const response = await fetch(urlWithParams, { headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` } });
  return response.json();
};

module.exports = {
  getTweets,
};
