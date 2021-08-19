const express = require('express');
const { getLocationDetails } = require('./api/geocoding');
const { getTweets } = require('./api/twitter');

const app = express();
app.use(express.json());

/**
 * Fetch tweets containing a given hashtag.
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
 *  data: [
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
 *  ]
 * }
 * 
 */
app.get('/api/tweets', async (req, res) => {
    
    const { hashtag } = req.query;

    if (!hashtag) {
        res.status(400);
        res.json({
            title: 'Invalid Request',
            detail: 'Please specify a hashtag',
        });
        return;
    }

    const jsonData = await getTweets(hashtag);

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
        data: tweets.map(tweet => ({
            author: users.find(user => user.id === tweet.author_id),
            tweet,
        })),
    });
});

/**
 * Fetch details about an array of locations.
 * 
 * Example:
 * 
 * GET /api/locations
 * 
 * body: 
 * {
 *  "locations": ["Washington D.C."]
 * }
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
    const locations = req.body.locations;

    if(!locations || !Array.isArray(locations)) {
        res.status(400);
        res.json({
            title: 'Invalid Request',
            detail: 'Please specify valid locations in the request body.',
        });
        return;
    }

    res.json({
        data: await getLocationDetails(locations),
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));