const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route Đăng ký và Đăng nhập
router.post('/register', authController.register);
router.post('/login', authController.login);

// Route Quên mật khẩu & Đặt lại mật khẩu bằng OTP
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;