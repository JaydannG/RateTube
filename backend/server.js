const express = require('express');
const axios = require('axios');

require('dotenv').config();

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/api/youtube', async (req, res) => {
    const query = req.query.q;
    const maxResults = parseInt(req.query.max) || 10;

    if (!query) {
        return res.status(400).json({ error: 'Missing query parameter ?q=' })
    }

    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                key: process.env.API_KEY,
                q: query,
                part: 'snippet',
                type: 'video',
                maxResults: maxResults
            }
        });

        res.json(response.data)
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch from YouTube API' })
    }
});

app.listen(PORT, () => {
    console.log(`YouTube proxy running at http://localhost:${PORT}`)
});