require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
  
const express = require('express');
const authRoutes = require('./routes/auth');

const app = express();
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('DevLens backend is alive');
});

app.listen(5000, () => {
  console.log('Backend running on port 5000');
});