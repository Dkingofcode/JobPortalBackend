const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { postCreateProfile } = require("../controllers/jobseeker");
const { postEditProfile } = require("../controllers/jobseeker");
const { postDeleteProfile } = require("../controllers/jobseeker");
const { postApply } = require("../controllers/jobseeker");
const { postWithdraw} = require("../controllers/jobseeker");


router.post('/create', postCreateProfile);
router.post('/edit/:id', postEditProfile);
router.post('/delete/:id', postDeleteProfile);
router.post('/apply/jobs/:jobid', postApply);
router.post('/withdraw/jobs/:jobid', postWithdraw);





// router.post('/profile', async (req, res) => {
//     try {
//         const { userId, profile } = req.body;
//         await User.findByIdAndUpdate(userId, { profile });
//         res.status(200).send('Profile updated');
//     } catch (error) {
//         res.status(500).send('Error updating profile');
//     }
// });


module.exports = router;