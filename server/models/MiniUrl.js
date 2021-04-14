const mongoose = require('mongoose');

const UrlSchema = mongoose.Schema({
    fullUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    }
});

const MiniUrl = mongoose.model('MiniUrl', UrlSchema);

module.exports = MiniUrl;