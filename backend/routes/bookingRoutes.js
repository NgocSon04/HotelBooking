const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.get('/admin', bookingController.getAllBookings);
router.put('/:id/status', bookingController.updateBookingStatus);
router.get('/user/:userId', bookingController.getUserBookings);

module.exports = router;