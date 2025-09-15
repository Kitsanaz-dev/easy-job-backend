const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database'); // your connectDB function

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
}));

// Routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/favorites', favoriteRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API is running');
});

module.exports = app;
