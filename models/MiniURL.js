const mongoose = require('mongoose');

const URLSchema = mongoose.Schema({
    fullUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    }
});

const MiniURL = mongoose.model('MiniURL', URLSchema);

module.exports = MiniURL;