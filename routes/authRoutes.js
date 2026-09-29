const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/select-role', authController.selectRole);

// Baris ini SANGAT PENTING agar file index.js bisa membacanya
module.exports = router;