if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

const express = require('express');
const mongoose  = require('mongoose');

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

    if(!fullUrl || !prefferedUrl) return res.render('index', { error: 'Enter all the details.' });

    if(prefferedUrl){
        try {
            const existingUrl = await MiniURL.findOne({ shortUrl: prefferedUrl });

            if(existingUrl) return res.render('index', { error: 'MiniURL already in use.' });
            
            const miniUrl = new MiniURL({
                fullUrl: fullUrl,
                shortUrl: prefferedUrl
            });
    
            const newMiniUrl = await miniUrl.save();

            res.render('index', { message: 'URL has been shortened.' });
        } catch(err) {
            console.error(err);
            res.render('index', { error: 'Internal error.' });
        }
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));