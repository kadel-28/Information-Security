require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
const clientBuildPath = path.join(__dirname, '../client/build');
console.log(`📁 Serving static files from: ${clientBuildPath}`);
app.use(express.static(clientBuildPath));

// Routes
const caesarCipherRoutes = require('./routes/caesarCipherRoutes');

app.use('/api/caesar', caesarCipherRoutes);

// API Info endpoint
app.get('/api', (req, res) => {
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

// Catch-all: Serve React app for all requests not matching /api
app.use((req, res) => {
  console.log(`📄 Serving React app for request: ${req.path}`);
  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      console.error(`Error serving index.html: ${err}`);
      res.status(500).send('Error loading app');
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
