const express = require('express');
const { getLocationDetails } = require('../api/geocoding');
const { getTweets } = require('../api/twitter');

const app = express();
app.use(express.json());

// Return tweets containing a given hashtag.
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
                author,
                tweet,
                author_location: locationDetails[author.location],
            }
        }),
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));