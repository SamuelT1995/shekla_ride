const prisma = require('../config/db');

// Get current user profile
exports.getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                role: true,
                status: true,
                avatarUrl: true,
                isVerified: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error retrieving profile' });
    }
};

// Update profile details
exports.updateProfile = async (req, res) => {
    try {
        const { fullName, email, phoneNumber } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                fullName,
                email,
                phoneNumber
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                role: true,
                status: true,
                avatarUrl: true
            }
        });

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Email or phone number already in use' });
        }
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};
