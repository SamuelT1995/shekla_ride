const express = require('express');
const router = express.Router();
const {
    getStats,
    getPendingUsers,
    verifyUser,
    getPendingCars,
    approveCar
} = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// All routes here require admin access
router.use(protect);
router.use(adminOnly);

router.get('/stats', getStats);
router.get('/pending-users', getPendingUsers);
router.put('/users/:id/verify', verifyUser);
router.get('/pending-cars', getPendingCars);
router.put('/cars/:id/approve', approveCar);

module.exports = router;
