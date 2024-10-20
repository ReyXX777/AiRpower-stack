const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware for parsing JSON and enabling CORS
app.use(express.json());
app.use(cors());

// MongoDB Connection
const db = require('./config/db');
db.connect();

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api', apiRoutes);

// Fallback to index.html for any other route
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
