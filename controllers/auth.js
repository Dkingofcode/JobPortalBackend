require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Assuming you have a User model defined
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const sendOtp = require('../utils/sendOtp');
const NodeCache = require('node-cache');
const otpCache = new NodeCache({ stdTTL: 300, checkperiod: 600 });

const router = express.Router();

// Signup endpoint
const otpStore = new Map(); // Key: email, Value: OTP


module.exports = { 
    
  postSignup: async (req, res) => {
        const { username, email, password } = req.body;
    
        try {
            // Check if user already exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }
    
            // Create new user
            user = new User({
                username,
                email,
                password,
                role: 'jobseeker'
            });
    
            // Hash password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
    
            // Save user to database
            await user.save();
    
            res.status(201).json({ msg: 'User registered successfully' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
},

// Validate input
// check('email', 'Please include a valid email').isEmail(),
//check('password', 'Password is required').exists(),

    postLogin: async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            const { email, password } = req.body;
    
            try {
                // Check if user exists
                let user = await User.findOne({ email });
                if (!user) {
                    return res.status(400).json({ msg: 'Invalid credentials' });
                }
    
                // Check password
                const isMatch = await bcrypt.compareSync(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({ msg: 'Invalid credentials' });
                }
    
                // Return jsonwebtoken
                const payload = {
                    user: {
                        id: user.id
                    }
                };

                console.log(process.env.JWT_SECRET);
                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: 360000 },
                    (err, token) => {
                        if (err) throw err;
                        res.json({ token });
                    }
                );
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        },

            postConfirmToken: async (req, res) => {
                const { token } = req.body;

                try {
                // Verify the token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
                // If token is valid, return success response
                res.json({ msg: 'Token is valid', user: decoded.user });
                } catch (err) {
                console.error(err.message);
                res.status(401).json({ msg: 'Token is not valid' });
                }
            },

        // Logout endpoint
      postLogout: async (req, res) =>  {
    // Invalidate the token (this can be done in various ways depending on your token management strategy)
    // For simplicity, we'll just send a success message
    res.json({ msg: 'User logged out successfully' });
},




  // Forgot Password endpoint
  postForgotPassword:
    // Validate input
    //check('email', 'Please include a valid email').isEmail(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;
        if(!email){
            return res.status(400).json({ msg: 'Please enter a valid email' });
        }
         

        try {
            // Check if user exists
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(200).json({ msg: 'A code has been sent to your mail' });
            }

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });


            // generate 6-digit OTP
            function generateOTP() {
               return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
              }

              const otp = generateOTP();

            // Store the OTP and its expiration time in the otpStore
              otpCache.set(email, otp );

            //const recipientMail = email;
            sendOtp(email, otp);
            console.log(otpCache.get(email));

            // Here you would send the resetToken to the user's email
            // For simplicity, we'll just return it in the response
            res.status(200).json(token);
           // res.json({ msg: 'A code has been sent to your mail' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error resetting password');  
        }
    },

    postValidateOTP: async (req, res) => {
        const { email, otp } = req.body;
    
        if (!email || !otp) {
            return res.status(400).json({ msg: 'Please enter a valid email and OTP' });
        }
    
        try {
            const storedOtp = otpCache.get(email);
    
            if (!storedOtp) {
                return res.status(400).json({ msg: 'Invalid or expired OTP' });
            }
    
            if (parseInt(otp, 10) !== storedOtp) {
                return res.status(400).json({ msg: 'Invalid OTP' });
            }
    
            // OTP is valid
            otpCache.del(email); // Delete OTP after successful validation
            res.status(200).json({ msg: 'OTP is valid' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    },
    

// Update Password endpoint
postResetPassword: async (req, res) => {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
        return res.status(400).json({ msg: 'Reset token and new password are required' });
    }

    try {
        // Verify the reset token
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid token' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Save the updated user
        await user.save();

        res.status(200).json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error('Error resetting password:', err.message);
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Invalid or expired token' });
        }
        res.status(500).send('Server error');
    }
  }
}









