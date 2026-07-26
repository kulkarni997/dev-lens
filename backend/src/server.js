require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const repoRoutes = require('./routes/repos');
const webhookRoutes = require('./routes/webhooks');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/auth', authRoutes);
app.use('/repos', repoRoutes);
app.use('/webhooks', webhookRoutes);

app.get('/', (req, res) => {
  res.send('DevLens backend is alive');
});

app.listen(5000, () => {
  console.log('Backend running on port 5000');
});