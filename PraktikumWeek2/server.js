const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware umum
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Import routes
const bookRoutes = require('./routes/books');
const movieRoutes = require('./routes/movies');
app.use('/api/books', bookRoutes);
app.use('/api/movies', movieRoutes);

// Middleware untuk 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
