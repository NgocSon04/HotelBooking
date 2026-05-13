const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const multer = require('multer');
const path = require('path');

// Cấu hình lưu ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// Routes cho Client
router.get('/client', offerController.getAllOffersClient);

// Routes cho Admin
router.get('/admin', offerController.getAllOffersAdmin);
router.post('/', upload.single('image'), offerController.createOffer);
router.put('/:id', upload.single('image'), offerController.updateOffer);
router.delete('/:id', offerController.deleteOffer);

module.exports = router;