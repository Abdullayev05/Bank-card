// Lazımi modul və kitabxanaları yükləyirik
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Express serverini yaratmaq
const app = express();
const port = 3001;

// Middleware
app.use(cors());  // CORS-u açır (cross-origin resource sharing)
app.use(bodyParser.json());  // JSON verilənlərini qəbul etməyə imkan verir

// MongoDB ilə əlaqə qururuq
mongoose.connect('mongodb://localhost:27017/cardDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB ilə əlaqə quruldu'))
  .catch(err => console.log(err));

// Kart məlumatları üçün Mongoose modeli yaradılır
const cardSchema = new mongoose.Schema({
  cardHolder: String,
  cardNumber: String,
  expiryDate: String,
  cvv: String
});

// "Card" adlı modeli yaratmaq
const Card = mongoose.model('Card', cardSchema);

// Kart məlumatlarını qəbul edən POST sorğusu
app.post('/api/saveCard', async (req, res) => {
  const { cardHolder, cardNumber, expiryDate, cvv } = req.body;

  // Kart məlumatlarını doğrulama
  if (!cardHolder || !cardNumber || !expiryDate || !cvv) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Kart nömrəsini və CVV-ni yoxlamaq
  if (!/^\d{16}$/.test(cardNumber)) {
    return res.status(400).json({ message: 'Invalid card number format' });
  }

  if (!/^\d{3}$/.test(cvv)) {
    return res.status(400).json({ message: 'Invalid CVV format' });
  }

  // Yeni kart məlumatını MongoDB-də saxlayırıq
  const newCard = new Card({
    cardHolder,
    cardNumber,
    expiryDate,
    cvv
  });

  try {
    await newCard.save();  // Verilənlər bazasına kart məlumatlarını əlavə edir
    res.status(200).json({ message: 'Data saved successfully' });  // Məlumat uğurla saxlanıb
  } catch (err) {
    res.status(500).json({ message: 'Error saving data' });  // Hata baş verdikdə cavab göndəririk
  }
});

// Məlumatları əldə etmək üçün GET endpoint
app.get('/api/getCards', async (req, res) => {
  try {
    const cards = await Card.find();  // Verilənlər bazasından bütün kart məlumatlarını götür
    res.status(200).json(cards);  // Bütün kartları JSON olaraq göndəririk
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving data' });  // Hata baş verdikdə cavab göndəririk
  }
});

// Serveri işə salmaq
app.listen(port, () => {
  console.log(`Server çalışır: http://localhost:${port}`);
});
