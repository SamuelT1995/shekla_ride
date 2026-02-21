const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, bookingController.createBooking);
router.get('/', protect, bookingController.getMyBookings);
router.get('/:id', protect, bookingController.getBookingById);
router.put('/:id/cancel', protect, bookingController.cancelBooking);

module.exports = router;
