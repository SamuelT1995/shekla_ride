const prisma = require('../config/db');

// Create a new car listing
exports.createCar = async (req, res) => {
    try {
        const {
            make, model, year, type, transmission,
            fuelType, seats, pricePerDay, location,
            description, images
        } = req.body;

        const car = await prisma.car.create({
            data: {
                ownerId: req.user.id,
                make,
                model,
                year: parseInt(year),
                type,
                transmission,
                fuelType,
                seats: parseInt(seats),
                pricePerDay: parseFloat(pricePerDay),
                location,
                description,
                images: images || [],
                status: 'PENDING' // Requires admin approval
            }
        });

        res.status(201).json({
            message: 'Car listed successfully and is pending approval',
            car
        });
    } catch (error) {
        console.error('Create car error:', error);
        res.status(500).json({ message: 'Server error creating car listing' });
    }
};

// Get all approved cars (Public)
exports.getAllCars = async (req, res) => {
    try {
        const { type, location, minPrice, maxPrice } = req.query;

        const filters = {
            status: 'APPROVED'
        };

        if (type) filters.type = type;
        if (location) filters.location = { contains: location, mode: 'insensitive' };
        if (minPrice || maxPrice) {
            filters.pricePerDay = {};
            if (minPrice) filters.pricePerDay.gte = parseFloat(minPrice);
            if (maxPrice) filters.pricePerDay.lte = parseFloat(maxPrice);
        }

        const cars = await prisma.car.findMany({
            where: filters,
            include: {
                owner: {
                    select: {
                        fullName: true,
                        avatarUrl: true
                    }
                }
            }
        });

        res.status(200).json(cars);
    } catch (error) {
        console.error('Get cars error:', error);
        res.status(500).json({ message: 'Server error retrieving cars' });
    }
};

// Get owner's cars
exports.getOwnerCars = async (req, res) => {
    try {
        const cars = await prisma.car.findMany({
            where: { ownerId: req.user.id }
        });

        res.status(200).json(cars);
    } catch (error) {
        console.error('Get owner cars error:', error);
        res.status(500).json({ message: 'Server error retrieving your cars' });
    }
};

// Get car by ID
exports.getCarById = async (req, res) => {
    try {
        const car = await prisma.car.findUnique({
            where: { id: req.params.id },
            include: {
                owner: {
                    select: {
                        fullName: true,
                        phoneNumber: true,
                        avatarUrl: true
                    }
                },
                reviews: {
                    include: {
                        user: {
                            select: { fullName: true, avatarUrl: true }
                        }
                    }
                }
            }
        });

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json(car);
    } catch (error) {
        console.error('Get car by ID error:', error);
        res.status(500).json({ message: 'Server error retrieving car details' });
    }
};

// Update car listing
exports.updateCar = async (req, res) => {
    try {
        const { id } = req.params;

        // Verify ownership
        const car = await prisma.car.findUnique({ where: { id } });

        if (!car) return res.status(404).json({ message: 'Car not found' });
        if (car.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to update this car' });
        }

        const updatedCar = await prisma.car.update({
            where: { id },
            data: {
                ...req.body,
                // Status resets to PENDING if critical fields change? 
                // For now, let's keep it simple.
                year: req.body.year ? parseInt(req.body.year) : undefined,
                seats: req.body.seats ? parseInt(req.body.seats) : undefined,
                pricePerDay: req.body.pricePerDay ? parseFloat(req.body.pricePerDay) : undefined,
            }
        });

        res.status(200).json({
            message: 'Car updated successfully',
            car: updatedCar
        });
    } catch (error) {
        console.error('Update car error:', error);
        res.status(500).json({ message: 'Server error updating car' });
    }
};

// Delete car listing
exports.deleteCar = async (req, res) => {
    try {
        const { id } = req.params;

        // Verify ownership
        const car = await prisma.car.findUnique({ where: { id } });

        if (!car) return res.status(404).json({ message: 'Car not found' });
        if (car.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to delete this car' });
        }

        await prisma.car.delete({ where: { id } });

        res.status(200).json({ message: 'Car listing deleted successfully' });
    } catch (error) {
        console.error('Delete car error:', error);
        res.status(500).json({ message: 'Server error deleting car' });
    }
};
