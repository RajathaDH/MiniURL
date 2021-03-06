if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

const app = express();

// middlewares
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'MiniURL' });
});

// shorten an URL
app.post('/shorten', (req, res) => {
    console.log(req.body);
    res.json({});
});

app.get('/:id', (req, res) => {
    console.log(req.params.id);
    res.json({});
});

// Route not found 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));