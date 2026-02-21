const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    status: true
                }
            });

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

const ownerOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'OWNER' || req.user.role === 'ADMIN')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an owner' });
    }
};

module.exports = { protect, adminOnly, ownerOnly };
