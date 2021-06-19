const { nanoid } = require('nanoid');
const Joi = require('joi');

const MiniUrl = require('../models/MiniUrl');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function shortenUrl(req, res) {
    const { fullUrl, shortUrl } = req.body;

    let urlData = {
        fullUrl,
        shortUrl
    }

    const urlSchema = Joi.object({
        fullUrl: Joi.string().required().trim(),
        shortUrl: Joi.string().allow('')
    });

    try {
        const result = urlSchema.validate(urlData);

        if (result.error) {
            console.log(result.error);
            return res.status(400).json({ error: 'Invalid details.' });
        }

        urlData = result.value;

        // generate a short URL if it is not passed
        if (!urlData.shortUrl) {
            urlData.shortUrl = nanoid(5);
        }

        // check if short URL already exists
        const existingMiniUrl = await MiniUrl.findOne({ shortUrl: urlData.shortUrl });
        if (existingMiniUrl) {
            return res.status(400).json({ error: 'Short URL already exists.' });
        }

        const newUrl = new MiniUrl(urlData);
        const newMiniUrl = await newUrl.save();
        const newShortUrl = `${BASE_URL}/${newMiniUrl.shortUrl}`;

        res.status(200).json({ message: 'Success', shortUrl: newShortUrl });
    } catch (err) {
        console.log(err);
    }
}

async function redirectMiniurl(req, res) {
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
}

module.exports = {
    shortenUrl,
    redirectMiniurl
}