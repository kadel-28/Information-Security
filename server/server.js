require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const caesarCipherRoutes = require('./routes/caesarCipherRoutes');

app.use('/api/caesar', caesarCipherRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Algorithm Visualizer API - MERN Stack',
    version: '1.0.0',
    algorithms: ['Caesar Cipher'],
    endpoints: {
      caesar: {
        encrypt: 'POST /api/caesar/encrypt',
        decrypt: 'POST /api/caesar/decrypt',
        bruteforce: 'POST /api/caesar/bruteforce',
        info: 'GET /api/caesar/info'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
