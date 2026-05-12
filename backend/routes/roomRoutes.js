const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById); 

// SỬA Ở 2 DÒNG NÀY: Dùng upload.array('images', 5) thay vì upload.single
router.post('/', upload.array('images', 5), roomController.createRoom);
router.put('/:id', upload.array('images', 5), roomController.updateRoom);

router.delete('/:id', roomController.deleteRoom);



module.exports = router;