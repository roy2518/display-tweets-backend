const express = require('express');
const { getLocationDetails } = require('../api/geocoding');
const { getTweets } = require('../api/twitter');
const {  isHashtagValid } = require('../util/twitter');

const app = express();
app.use(express.json());

// Return tweets containing a given hashtag.
app.get('/api/twitter', async (req, res) => {
    
    const { hashtag } = req.query;

    if (!hashtag || !isHashtagValid(hashtag)) {
        res.status(400);
        res.json({
            title: 'Invalid Request',
            detail: 'Hashtag is missing or invalid.',
        });
        return;
    }

    const tweets = await getTweets(hashtag);

    // Error returned from Twitter API
    if (tweets.title && tweets.detail) {
        if (tweets.status) {
            res.status(tweets.status);
        } else {
            res.status(400);
        }
        res.json({
            title: tweets.title,
            detail: tweets.detail,
        });
        return;
    }

    // No results
    if (tweets.meta.result_count === 0) {
        res.json({ data: [] });
        return;
    }

    res.json({ data: tweets });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));