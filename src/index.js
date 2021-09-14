const express = require('express');
const cors = require('cors');
const he = require('he');
const { getLocationDetails } = require('./api/geocoding');
const { getTweets } = require('./api/twitter');

const app = express();
app.use(express.json());

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
}));

/**
 * Fetch tweets containing a given hashtag.
 * The `nextToken` query parameter is optional
 * and used to get the next page of results.
 *
 * Returns an HTTP 400 if the hashtag is not specified,
 * or if the Twitter API returns an error.
 *
 * Example:
 *
 * GET /api/twitter?hashtag="trending"
 *
 * Response:
 *
 * {
 *  data: {
 *    tweets:
 *    [
 *      {
 *         author: {
 *             name: Bob,
 *             username: Bob1234,
 *             id: 123456789,
 *             profile_image_url: "example.jpg",
 *             location: USA,
 *         },
 *         tweet: {
 *             created_at: 2021-08-15,
 *             id: 987654321,
 *             text: "Example tweet text here! #trending",
 *             author_id: 123456789
 *         }
 *      },
 *      ...
 *     ]
 *  },
 *  next_token: 1234567,
 * }
 *
 */
app.get('/api/tweets', async (req, res) => {
  const { hashtag, next_token: nextToken } = req.query;

  if (!hashtag) {
    res.status(400);
    res.json({
      title: 'Invalid Request',
      detail: 'Please specify a hashtag',
    });
    return;
  }

  const jsonData = await getTweets(hashtag, nextToken);
  console.log(JSON.stringify(jsonData));

  // Error returned from Twitter API
  if (jsonData.title && jsonData.detail) {
    if (jsonData.status) {
      res.status(jsonData.status);
    } else {
      res.status(400);
    }
    res.json({
      title: jsonData.title,
      detail: jsonData.detail,
    });
    return;
  }

  // No results
  if (jsonData.meta.result_count === 0) {
    res.json({ data: [] });
    return;
  }

  const tweets = jsonData.data;
  const { users } = jsonData.includes;

  res.json({
    data:
    {
      tweets: tweets.map((tweet) => ({
        author: users.find((user) => user.id === tweet.author_id),
        tweet: {
          ...tweet, text: he.decode(tweet.text),
        },
      })),
    },
    next_token: jsonData.meta.next_token,
  });
});

/**
 * Fetch details about an array of locations.
 *
 * Example:
 *
 * GET /api/locations?names=["Washington D.C."]
 *
 * Response:
 * {
 *  "data": {
 *       "Washington D.C.": {
 *           "address": {
 *               "city": "Washington",
 *               "state": "District of Columbia",
 *               "country": "United States of America",
 *               "country_code": "us"
 *           },
 *           "display_name": "Washington, District of Columbia, United States of America",
 *           "lat": "38.8949549",
 *           "lon": "-77.0366456"
 *       }
 *   }
 * }
 */
app.get('/api/locations', async (req, res) => {
  let { names } = req.query;
  names = JSON.parse(names);

  if (!names || !Array.isArray(names)) {
    res.status(400);
    res.json({
      title: 'Invalid Request',
      detail: 'Please specify valid location names.',
    });
    return;
  }

  res.json({
    data: await getLocationDetails(names),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => undefined);
