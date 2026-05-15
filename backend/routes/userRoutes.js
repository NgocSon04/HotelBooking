const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Khai báo các API end-points
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser); // API Thêm
router.put('/:id', userController.updateUser); // API Sửa
router.delete('/:id', userController.deleteUser); // API Xóa

module.exports = router;