const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint dilindungi oleh authMiddleware
router.get('/', authMiddleware, menuController.getMenus);

module.exports = router;