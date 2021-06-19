if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const miniurlController = require('./controllers/miniurl');

// database connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

//app.set('trust proxy', 1); // use when deployed to trust proxy

const rateLimiter = rateLimit({
    windowMs: 0.5 * 60 * 1000,
    max: 2,
    message: JSON.stringify({ error: 'Too many requests, try again in 30 seconds.' })
});

app.get('/', (req, res) => {
    res.json({ message: 'MiniURL' });
});

// shorten an URL
app.post('/shorten', rateLimiter, miniurlController.shortenUrl);

// redirect to a shortened URL
app.get('/:id', miniurlController.redirectMiniurl);

// Route not found 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));