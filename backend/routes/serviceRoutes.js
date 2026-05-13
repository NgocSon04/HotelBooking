const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Cấu hình tạm đơn giản để test

router.get('/', serviceController.getAllServices);
router.post('/', upload.single('image'), serviceController.createService);


router.put('/:id', upload.single('image'), serviceController.updateService); 

router.delete('/:id', serviceController.deleteService);

module.exports = router;