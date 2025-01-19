const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { validationResult } = require('express-validator');


module.exports = {

     createProfile: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        try {
            const { bio, skills, company, email, phone, userType } = req.body;
    
            // Fetch the user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Validate and set the role (userType)
            if (userType && ['jobseeker', 'employer'].includes(userType)) {
                user.role = userType; // Update the top-level role
            }
    
            // Update the profile fields
            if (bio) user.profile.bio = bio;
            if (skills) user.profile.skills = skills;
            if (company) {
                if (user.role !== 'employer') {
                    return res.status(403).json({ message: 'Only employers can update the company field' });
                }
                user.profile.company = company;
            }
    
            // Save the updated user
            await user.save();
    
            return res.status(200).json({ message: 'Profile updated successfully', user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    
}
