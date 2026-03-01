const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// Register a new user
exports.register = async (req, res) => {
    try {
        let { fullName, email, phoneNumber, password, role, agencyName, registrationNum } = req.body;

        email = email.toLowerCase();

        // Process files if any
        const files = req.files || {};
        const licenseFront = files.licenseFront ? `/uploads/${files.licenseFront[0].filename}` : null;
        const licenseBack = files.licenseBack ? `/uploads/${files.licenseBack[0].filename}` : null;
        const businessLicense = files.businessLicense ? `/uploads/${files.businessLicense[0].filename}` : null;

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

        // Transaction to ensure atomicity for agency registration
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    fullName,
                    email,
                    phoneNumber,
                    password: hashedPassword,
                    role: role || 'USER',
                    licenseFront,
                    licenseBack,
                }
            });

            if (role === 'AGENCY_OWNER') {
                if (!agencyName || !registrationNum || !businessLicense) {
                    throw new Error('Agency details (name, registration number, business license) are required');
                }

                await tx.agency.create({
                    data: {
                        name: agencyName,
                        registrationNum: registrationNum,
                        businessLicense: businessLicense,
                        ownerId: user.id,
                        status: 'PENDING'
                    }
                });
            }

            return user;
        });

        // Generate JWT
        const token = jwt.sign(
            { id: result.id, role: result.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: role === 'AGENCY_OWNER' ? 'Agency registered successfully. Pending approval.' : 'User registered successfully',
            token,
            user: {
                id: result.id,
                fullName: result.fullName,
                email: result.email,
                role: result.role,
                status: result.status
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(error.message.includes('Agency details') ? 400 : 500).json({
            message: error.message || 'Server error during registration'
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { loginIdentifier, password } = req.body;
        const normalizedIdentifier = loginIdentifier.toLowerCase();

        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: normalizedIdentifier }, { phoneNumber: loginIdentifier }]
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

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
