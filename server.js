if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

const express = require('express');
const mongoose  = require('mongoose');
const { nanoid } = require('nanoid');

const MiniURL = require('./models/MiniURL');

const DB_URI = process.env.MONGODB_URI;
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/shorten', async (req, res) => {
    const { fullUrl, prefferedUrl } = req.body;

    if(!fullUrl) return res.render('index', { error: 'Enter a valid URL.' });

    try {
        let miniUrl;
        if(prefferedUrl){
            const existingUrl = await MiniURL.findOne({ shortUrl: prefferedUrl });

            if(existingUrl) return res.render('index', { error: 'MiniURL already in use.' });
            
            miniUrl = new MiniURL({
                fullUrl: fullUrl,
                shortUrl: prefferedUrl
            });
        } else {
            miniUrl = new MiniURL({
                fullUrl: fullUrl,
                shortUrl: nanoid(4)
            });
        }

        const newMiniUrl = await miniUrl.save();

        res.render('index', { message: 'URL has been shortened.' });
    } catch(err) {
        console.error(err);
        res.render('index', { error: 'Internal error.' });
    }
});

app.get('/:id', async (req, res) => {
    const shortUrl = req.params.id;

    const miniUrl = await MiniURL.findOne({ shortUrl });

    if(miniUrl){
        const fullUrl = miniUrl.fullUrl;

        res.redirect(fullUrl);
    } else {
        res.render('index', { error: 'Invalid URL.' });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));