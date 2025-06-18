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
    const videoId = req.query.id;
    const maxResults = parseInt(req.query.max) || 10;
    const pageToken = req.query.pageToken || undefined;

    try {
        if (videoId) {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                params: {
                    key: process.env.API_KEY,
                    id: videoId,
                    part: 'snippet,statistics,contentDetails'
                }
            });
            return res.json(response.data);
        }

        if (query) {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    key: process.env.API_KEY,
                    q: query,
                    part: 'snippet',
                    type: 'video,channel',
                    maxResults,
                    pageToken
                }
            });
            return res.json(response.data);
        }

        res.status(400).json({ error: 'Missing query parameter: ?q= or ?id=' });
    } catch (err) {
        console.error('YouTube API Error: ', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch from YouTube API' });
    }
});

app.get('/api/channel', async (req, res) => {
    const input = req.query.id;
    if (!input) return res.status(400).json({ error: 'Missing id' });

    let channelId = input;

    try {
        if (!channelId.startsWith('UC')) {
            const searchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    key: process.env.API_KEY,
                    q: input.replace('@', ''),
                    type: 'channel',
                    part: 'snippet',
                    maxResults: 1
                }
            });

            const found = searchRes.data.items?.[0];
            if (!found) return res.status(404).json({ error: 'Channel not found' });

            channelId = found.id.channelId;
        }

        // Fetch actual channel details
        const channelRes = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
            params: {
                key: process.env.API_KEY,
                id: channelId,
                part: 'snippet,statistics'
            }
        });

        const channelData = channelRes.data.items?.[0];
        if (!channelData) return res.status(404).json({ error: 'Channel details not found' });

        res.json(channelData);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch channel info' });
    }
});

app.get('/api/channel/videos', async (req, res) => {
    const input = req.query.id;
    const pageToken = req.query.pageToken || '';

    if (!input) return res.status(400).json({ error: 'Missing id' });

    try {
        let channelId = input;

        if (!channelId.startsWith('UC')) {
            const searchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    key: process.env.API_KEY,
                    q: input.replace('@', ''),
                    type: 'channel',
                    part: 'snippet',
                    maxResults: 1
                }
            });

            const match = searchRes.data.items?.[0];
            if (!match) return res.status(404).json({ error: 'Channel not found' });

            channelId = match.id.channelId;
        }

        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                key: process.env.API_KEY,
                channelId,
                part: 'snippet',
                type: 'video',
                order: 'date',
                maxResults: 10,
                pageToken
            }
        });

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch channel videos' });
    }
});

app.listen(PORT, () => {
    console.log(`YouTube proxy running at http://localhost:${PORT}`);
});