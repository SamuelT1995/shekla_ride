const express = require('express');
const router = express.Router();
const {
    getAgencyProfile,
    addStaff,
    addVehicle
} = require('../controllers/agency.controller');
const { protect, agencyOnly, agencyOwnerOnly } = require('../middleware/auth.middleware');

// All agency routes are protected
router.use(protect);

// Get agency profile, staff and fleet (Staff or higher)
router.get('/profile', agencyOnly, getAgencyProfile);

// Add staff member (Only Owner)
router.post('/staff', agencyOwnerOnly, addStaff);

// Add vehicle to fleet (Owner or Manager)
router.post('/fleet', agencyOnly, addVehicle);

module.exports = router;
