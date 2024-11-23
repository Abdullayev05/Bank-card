const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/bankCardDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Mongoose Schema
const cardSchema = new mongoose.Schema({
  cardHolder: String,
  cardNumber: String,
  expiryDate: String,
  cvv: String
});

const Card = mongoose.model('Card', cardSchema);

// API Routes
app.post('/api/cards', (req, res) => {
  const newCard = new Card(req.body);
  newCard.save()
    .then(() => res.status(201).send("Card added successfully"))
    .catch(err => res.status(400).send(err));
});

app.get('/api/cards', (req, res) => {
  Card.find()
    .then(cards => res.json(cards))
    .catch(err => res.status(400).send(err));
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
