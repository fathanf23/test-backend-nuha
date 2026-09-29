const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db'); 

// Import semua routes
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');

const app = express();

app.use(cors());
app.use(express.json()); 

// Endpoint dasar
app.get('/', (req, res) => {
    res.json({ message: 'Backend API berjalan dengan baik!' });
});

// Daftarkan semua routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});