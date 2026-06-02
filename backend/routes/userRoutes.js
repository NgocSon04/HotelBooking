const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const path = require('path');

// Cấu hình tải lên hình ảnh cho avatar
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Khai báo các API end-points
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser); // API Thêm
router.put('/:id', userController.updateUser); // API Sửa
router.delete('/:id', userController.deleteUser); // API Xóa (Đã vô hiệu hóa - chỉ dùng block)

router.post('/:id/save-offer', userController.saveOffer);
router.post('/:id/remove-offer', userController.removeOffer);
router.get('/:id/saved-offers', userController.getSavedOffers);
router.get('/:id', userController.getUserById); // Lấy chi tiết user
router.put('/:id/profile', upload.single('avatar'), userController.updateProfile); // Sửa profile cá nhân

module.exports = router;