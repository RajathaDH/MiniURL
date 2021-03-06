if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.json({ message: 'MiniURL' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));