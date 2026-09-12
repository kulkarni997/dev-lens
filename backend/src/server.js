require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const repoRoutes = require('./routes/repos');
const webhookRoutes = require('./routes/webhooks');
const reviewRoutes = require('./routes/reviews');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiters');
const { register, httpRequestDuration } = require('./metrics');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const route = req.route?.path || req.path;
    end({ method: req.method, route, status_code: res.statusCode });
  });
  next();
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/auth', authLimiter, authRoutes);
app.use('/repos', apiLimiter, repoRoutes);
app.use('/reviews', apiLimiter, reviewRoutes);
app.use('/webhooks', webhookRoutes);

app.get('/', (req, res) => {
  res.send('DevLens backend is alive');
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

require('./workers/reviewWorker');

app.listen(5000, () => {
  console.log('Backend running on port 5000');
});
