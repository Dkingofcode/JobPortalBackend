const express = require('express');
const router = express.Router();
const { createProfile } = require('../controllers/profile');


router.post('/profile', createProfile);

module.exports = router;






















