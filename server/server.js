require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build - HIGH PRIORITY
const clientBuildPath = path.join(__dirname, '../client/build');
console.log(`📁 Static files path: ${clientBuildPath}`);
console.log(`📁 Path exists: ${fs.existsSync(clientBuildPath)}`);

// Serve all static files (CSS, JS, images, etc.)
app.use(express.static(clientBuildPath));

// API Routes - BEFORE catch-all
const caesarCipherRoutes = require('./routes/caesarCipherRoutes');
app.use('/api/caesar', caesarCipherRoutes);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Algorithm Visualizer API',
    version: '1.0.0'
  });
});

// SPA Fallback - LAST (catch-all for React Router)
app.get('*', (req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  console.log(`📄 Serving SPA: ${req.path} -> ${indexPath}`);
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error(`❌ index.html not found at ${indexPath}`);
    res.status(404).json({ error: 'index.html not found' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
});
