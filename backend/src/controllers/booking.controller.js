const prisma = require('../config/db');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { carId, startDate, endDate, totalDays, totalPrice } = req.body;

        // 1. Check if user is verified
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user.isVerified && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                message: 'Your account must be verified by an admin before you can book a car.'
            });
        }

        // 2. Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start < new Date()) {
            return res.status(400).json({ message: 'Start date cannot be in the past' });
        }
        if (end <= start) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        // 3. Check car availability (no overlapping bookings)
        const overlapping = await prisma.booking.findFirst({
            where: {
                carId: carId,
                status: { in: ['PENDING', 'CONFIRMED'] },
                OR: [
                    { startDate: { lte: end }, endDate: { gte: start } }
                ]
            }
        });

        if (overlapping) {
            return res.status(400).json({ message: 'Car is not available for the selected dates' });
        }

        // 4. Create booking
        const booking = await prisma.booking.create({
            data: {
                renterId: req.user.id,
                carId: carId,
                startDate: start,
                endDate: end,
                totalPrice: parseFloat(totalPrice),
                status: 'PENDING'
            },
            include: {
                car: {
                    select: { make: true, model: true }
                }
            }
        });

        res.status(201).json({
            message: 'Booking request sent successfully!',
            booking
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: 'Server error creating booking' });
    }
};

// Get current user's bookings
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { renterId: req.user.id },
            include: {
                car: {
                    select: {
                        make: true,
                        model: true,
                        images: true,
                        location: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Get my bookings error:', error);
        res.status(500).json({ message: 'Server error retrieving bookings' });
    }
};

// Get booking details
exports.getBookingById = async (req, res) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: req.params.id },
            include: {
                car: {
                    include: {
                        owner: { select: { fullName: true, phoneNumber: true } }
                    }
                },
                user: { select: { fullName: true, phoneNumber: true, email: true } }
            }
        });

        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Authorization check
        if (booking.renterId !== req.user.id && booking.car.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to view this booking' });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error('Get booking entry error:', error);
        res.status(500).json({ message: 'Server error retrieving booking details' });
    }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: req.params.id }
        });

        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.renterId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
            return res.status(400).json({ message: `Cannot cancel a booking that is already ${booking.status}` });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: req.params.id },
            data: { status: 'CANCELLED' }
        });

        res.status(200).json({ message: 'Booking cancelled successfully', booking: updatedBooking });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ message: 'Server error cancelling booking' });
    }
};
