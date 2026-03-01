const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

// @desc    Get agency profile, staff and fleet
// @route   GET /api/agency/profile
// @access  Private (Agency Owner/Manager/Staff)
const getAgencyProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                agency: {
                    include: {
                        owner: { select: { fullName: true, email: true } },
                        staff: { select: { id: true, fullName: true, email: true, role: true } },
                        fleet: true
                    }
                },
                ownedAgency: {
                    include: {
                        staff: { select: { id: true, fullName: true, email: true, role: true } },
                        fleet: true
                    }
                }
            }
        });

        const agency = user.ownedAgency || user.agency;

        if (!agency) {
            return res.status(404).json({ message: 'Agency not found' });
        }

        res.json(agency);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a staff member to agency
// @route   POST /api/agency/staff
// @access  Private (Agency Owner)
const addStaff = async (req, res) => {
    const { fullName, email, phoneNumber, password, role } = req.body;

    try {
        // Only Agency Owner can add staff
        if (req.user.role !== 'AGENCY_OWNER') {
            return res.status(403).json({ message: 'Only agency owners can add staff' });
        }

        const owner = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { ownedAgency: true }
        });

        if (!owner.ownedAgency) {
            return res.status(404).json({ message: 'Agency not found' });
        }

        // Check if user already exists
        const userExists = await prisma.user.findFirst({
            where: { OR: [{ email }, { phoneNumber }] }
        });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStaff = await prisma.user.create({
            data: {
                fullName,
                email,
                phoneNumber,
                password: hashedPassword,
                role: role || 'AGENCY_STAFF',
                agencyId: owner.ownedAgency.id,
                status: 'VERIFIED' // Staff added by owner are pre-verified
            }
        });

        res.status(201).json({
            message: 'Staff member added successfully',
            staff: {
                id: newStaff.id,
                fullName: newStaff.fullName,
                email: newStaff.email,
                role: newStaff.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a vehicle to agency fleet
// @route   POST /api/agency/fleet
// @access  Private (Agency Owner/Manager)
const addVehicle = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { ownedAgency: true, agency: true }
        });

        const agency = user.ownedAgency || user.agency;

        if (!agency) {
            return res.status(404).json({ message: 'Agency not found' });
        }

        if (req.user.role !== 'AGENCY_OWNER' && req.user.role !== 'AGENCY_MANAGER') {
            return res.status(403).json({ message: 'Not authorized to add vehicles' });
        }

        const carData = {
            ...req.body,
            agencyId: agency.id,
            status: 'PENDING'
        };

        const car = await prisma.car.create({
            data: carData
        });

        res.status(201).json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAgencyProfile,
    addStaff,
    addVehicle
};
