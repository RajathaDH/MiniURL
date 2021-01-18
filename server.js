if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

const express = require('express');
const mongoose  = require('mongoose');

const DB_URI = process.env.MONGODB_URI;
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

const app = express();

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));