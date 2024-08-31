const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Serve static files (CSS, JS) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API route for search
app.get('/search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).send({ error: 'Query parameter is required' });
    }

    try {
        const response = await axios.get('https://api.bing.microsoft.com/v7.0/search', {
            headers: { 'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY },
            params: { q: query },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from Bing API:', error);
        res.status(500).send({ error: 'Failed to fetch data from Bing API' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
