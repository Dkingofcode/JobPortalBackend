const express = require('express');
const router = express.Router();
const { createProfile } = require('../controllers/profile');
const { createResume } = require('../controllers/profile');

router.post('/profile', createProfile);
router.post('/generate-resume-section', createResume);

module.exports = router;






















