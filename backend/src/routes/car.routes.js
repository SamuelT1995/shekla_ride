const express = require('express');
const router = express.Router();
const carController = require('../controllers/car.controller');
const { protect, ownerOnly } = require('../middleware/auth.middleware');

// Public routes
router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);

// Protected Owner routes
router.post('/', protect, ownerOnly, carController.createCar);
router.get('/my-cars', protect, ownerOnly, carController.getOwnerCars);
router.put('/:id', protect, ownerOnly, carController.updateCar);
router.delete('/:id', protect, ownerOnly, carController.deleteCar);

module.exports = router;
