const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route lấy danh sách tài khoản cho Admin
router.get('/', userController.getAllUsers);

module.exports = router;