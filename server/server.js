require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
const clientBuildPath = path.join(__dirname, '../client/build');
console.log(`📁 Static files path: ${clientBuildPath}`);
console.log(`📁 Path exists: ${fs.existsSync(clientBuildPath)}`);

// List build directory contents
if (fs.existsSync(clientBuildPath)) {
  console.log(`📂 Build directory contents:`, fs.readdirSync(clientBuildPath));
  const indexPath = path.join(clientBuildPath, 'index.html');
  console.log(`📄 index.html exists: ${fs.existsSync(indexPath)}`);
}

// Logging middleware
app.use((req, res, next) => {
  console.log(`📍 Incoming request: ${req.method} ${req.path}`);
  next();
});

// Serve all static files (CSS, JS, images, etc.) with caching headers
app.use(express.static(clientBuildPath, {
  maxAge: '1d',
  etag: false
}));

// API Routes
const caesarCipherRoutes = require('./routes/caesarCipherRoutes');
app.use('/api/caesar', caesarCipherRoutes);

// API info endpoint
app.get('/api', (req, res) => {
  console.log(`📡 API info endpoint called`);
  res.json({
    message: 'Algorithm Visualizer API',
    version: '1.0.0'
  });
});

// SPA Fallback - catch-all for React Router (MUST be last)
app.use((req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  console.log(`🎯 Catch-all: serving ${indexPath} for ${req.path}`);
  
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
  console.log(`🌐 Visit your app at http://localhost:${PORT}`);
});
