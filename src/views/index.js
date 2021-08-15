const express = require('express');
const { getLocationDetails } = require('../dal/geocoding');
const { getTweets } = require('../dal/twitter');

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
 *             location_details: {
 *                 address: {
 *                     country: "United States of America",
 *                     country_code: "us"
 *                 },
 *                 lat: 37.0902,
 *                 lon: 95.7129
 *             }
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
app.get('/api/twitter', async (req, res) => {
    
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

    const locationDetails = await getLocationDetails(
        users.map(user => user.location).filter(location => location)
    );

    res.json({
        data: tweets.map(tweet => {
            const author = users.find(user => user.id === tweet.author_id);
            return {
                author: {
                    ...author,
                    location_details: locationDetails[author.location],
                },
                tweet,
            }
        }),
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));