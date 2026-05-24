const express = require('express');
const router = express.Router();
const serviceBookingController = require('../controllers/serviceBookingController');

router.post('/', serviceBookingController.createServiceBooking);
router.get('/user/:userId', serviceBookingController.getUserServiceBookings);
router.get('/admin', serviceBookingController.getAllServiceBookings);
router.put('/:id/status', serviceBookingController.updateServiceBookingStatus);

module.exports = router;
