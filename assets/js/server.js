const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Express serveri yaratmaq
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // JSON verilənlərini oxumaq üçün

// MongoDB bağlantısı qurmaq
mongoose.connect('mongodb://localhost:27017/cardDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB ilə əlaqə quruldu'))
    .catch(err => console.log(err));

// Kart məlumatlarının modelini yaratmaq
const cardSchema = new mongoose.Schema({
    cardHolder: String,
    cardNumber: String,
    expiryDate: String,
    cvv: String
});

const Card = mongoose.model('Card', cardSchema);

// Kart məlumatlarını qəbul etmək üçün POST endpoint
app.post('/api/saveCard', async (req, res) => {
    const { cardHolder, cardNumber, expiryDate, cvv } = req.body;

    // Yeni kart məlumatını verilənlər bazasına əlavə et
    const newCard = new Card({
        cardHolder,
        cardNumber,
        expiryDate,
        cvv
    });

    try {
        await newCard.save();  // Məlumatı bazaya əlavə et
        res.status(200).json({ message: 'Data saved successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error saving data' });
    }
});

// Məlumatları əldə etmək üçün GET endpoint
app.get('/api/getCards', async (req, res) => {
    try {
        const cards = await Card.find(); // Verilənlər bazasından bütün kart məlumatlarını götür
        res.status(200).json(cards);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving data' });
    }
});

// Serveri işə salmaq
app.listen(port, () => {
    console.log(`Server çalışır http://localhost:${port}`);
});
