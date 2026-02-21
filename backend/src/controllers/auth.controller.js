const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, role } = req.body;

        // Check if user already exists
        const userExists = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { phoneNumber }]
            }
        });

        if (userExists) {
            return res.status(400).json({ message: 'User with this email or phone number already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                phoneNumber,
                password: hashedPassword,
                role: role || 'USER'
            }
        });

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { loginIdentifier, password } = req.body; // email or phone

        // Find user
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: loginIdentifier }, { phoneNumber: loginIdentifier }]
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};
