if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { nanoid } = require('nanoid');
const Joi = require('joi');

const MiniUrl = require('./models/MiniUrl');

// database connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'MiniURL' });
});

// shorten an URL
app.post('/shorten', async (req, res) => {
    const { fullUrl, shortUrl } = req.body;

    let urlData = {
        fullUrl,
        shortUrl
    }

    const urlSchema = Joi.object({
        fullUrl: Joi.string().required().trim(),
        shortUrl: Joi.string().trim()
    });

    try {
        const result = urlSchema.validate(urlData);

        if (result.error) {
            return res.status(400).json({ error: 'Invalid details' });
        }

        urlData = result.value;

        // generate a short URL if it is not passed
        if (!urlData.shortUrl) {
            urlData.shortUrl = nanoid(5);
        }

        // check if short URL already exists
        const existingMiniUrl = await MiniUrl.findOne({ shortUrl: urlData.shortUrl });
        if (existingMiniUrl) {
            return res.status(400).json({ error: 'Short URL already exists' });
        }

        const newUrl = new MiniUrl(urlData);
        const newMiniUrl = await newUrl.save();

        res.status(200).json({ message: 'Success', shortUrl: newMiniUrl.shortUrl });
    } catch(err) {
        console.log(err);
    }
});

// redirect to a shortened URL
app.get('/:id', async (req, res) => {
    const shortUrl = req.params.id;

    try {
        const miniUrl = await MiniUrl.findOne({ shortUrl });

        if (miniUrl) {
            const fullUrl = miniUrl.fullUrl;

            res.redirect(fullUrl);
        } else {
            res.status(404).json({ message: 'Invalid url' });
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Error' });
    }
});

// Route not found 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));