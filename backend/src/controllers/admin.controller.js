const prisma = require('../config/db');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const [userCount, carCount, bookingCount, totalRevenue] = await Promise.all([
            prisma.user.count(),
            prisma.car.count(),
            prisma.booking.count(),
            prisma.booking.aggregate({
                _sum: { totalPrice: true },
                where: { status: 'CONFIRMED' }
            })
        ]);

        res.json({
            users: userCount,
            cars: carCount,
            bookings: bookingCount,
            revenue: totalRevenue._sum.totalPrice || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all pending verifications (users)
// @route   GET /api/admin/pending-users
// @access  Private/Admin
const getPendingUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { status: 'PENDING' },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                createdAt: true,
                licenseFront: true,
                licenseBack: true
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify/Reject a user
// @route   PUT /api/admin/users/:id/verify
// @access  Private/Admin
const verifyUser = async (req, res) => {
    const { status } = req.body; // 'VERIFIED' or 'REJECTED'
    try {
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: {
                status: status,
                isVerified: status === 'VERIFIED'
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all cars pending approval
// @route   GET /api/admin/pending-cars
// @access  Private/Admin
const getPendingCars = async (req, res) => {
    try {
        const cars = await prisma.car.findMany({
            where: { status: 'PENDING' },
            include: {
                owner: {
                    select: { fullName: true, email: true }
                }
            }
        });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve/Reject a car
// @route   PUT /api/admin/cars/:id/approve
// @access  Private/Admin
const approveCar = async (req, res) => {
    const { isVerified } = req.body;
    try {
        const car = await prisma.car.update({
            where: { id: req.params.id },
            data: { status: isVerified ? 'APPROVED' : 'REJECTED' }
        });
        res.json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStats,
    getPendingUsers,
    verifyUser,
    getPendingCars,
    approveCar
};
