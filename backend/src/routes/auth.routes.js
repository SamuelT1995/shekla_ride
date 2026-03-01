const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

const upload = require('../middleware/upload.middleware');

router.post('/register', upload.fields([
    { name: 'licenseFront', maxCount: 1 },
    { name: 'licenseBack', maxCount: 1 },
    { name: 'businessLicense', maxCount: 1 }
]), authController.register);
router.post('/login', authController.login);

module.exports = router;
