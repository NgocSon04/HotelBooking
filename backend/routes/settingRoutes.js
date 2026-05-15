const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
// const { protect, admin } = require('../middleware/authMiddleware'); // Có thể thêm middleware bảo mật sau nếu cần

// Client có thể GET
router.get('/', settingController.getSettings);

// Admin có thể PUT (Tạm thời mở public để phát triển nhanh, bạn có thể thêm middleware protect, admin sau)
router.put('/', settingController.updateSettings);

module.exports = router;
