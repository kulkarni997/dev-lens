require('dotenv').config();
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