const { postSignup } =  require ("../controllers/auth");
const { postLogin } =  require("../controllers/auth");
const { postForgotPassword } = require("../controllers/auth");
const { postResetPassword } = require ("../controllers/auth");
const { postUpdateDetails } = require ("../controllers/auth") ;
const { postLogout }  = require("../controllers/auth");
const { postConfirmToken } = require("../controllers/auth");
const { postValidateOTP } = require("../controllers/auth");



const express = require('express');
const router = express.Router();

router.post('/signup', postSignup);
router.post('/login', postLogin);
router.post('/confirmToken', postConfirmToken);
router.post('/forgot-password', postForgotPassword);
router.post('/validateOTP', postValidateOTP);
router.post('/reset-password', postResetPassword);
//router.post("/profile/:id", postUpdateDetails);


// router.post('/update-details', postUpdateDetails);
// router.post('/logout', postLogout);
module.exports = router;


