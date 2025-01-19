const express = require('express');
const user = require('../models/User'); // Assuming you have a JobSeeker model

const router = express.Router();

const JobSeeker = user.findOne({ role: 'jobseeker' });

module.exports = {

// Create a new profile
postCreateProfile: async (req, res) => {
    try {
        const newProfile = new (req.body);
        await newProfile.save();
        res.status(201).json(newProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
},

// Edit an existing profile
postEditProfile: async (req, res) => {
   try {
       const updatedProfile = await JobSeeker.findByIdAndUpdate(req.params.id, req.body, { new: true });
       if (!updatedProfile) {
           return res.status(404).json({ message: 'Profile not found' });
       }
       res.status(200).json(updatedProfile);
   } catch (error) {
       res.status(400).json({ message: error.message });
   }
},

// Delete a profile
 postDeleteProfile: async (req, res) => {
    try {
        const deletedProfile = await JobSeeker.findByIdAndDelete(req.params.id);
        if (!deletedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
},


// Apply for a job
 postApply: async (req, res) => {
    try {
        const jobSeeker = await JobSeeker.findById(req.params.id);
        if (!jobSeeker) {
            return res.status(404).json({ message: 'Job Seeker not found' });
        }
        jobSeeker.appliedJobs.push(req.body.jobId);
        await jobSeeker.save();
        res.status(200).json(jobSeeker);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
},

// Withdraw application
 postWithdraw: async (req, res) => {
    try {
        const jobSeeker = await JobSeeker.findById(req.params.id);
        if (!jobSeeker) {
            return res.status(404).json({ message: 'Job Seeker not found' });
        }
        jobSeeker.appliedJobs = jobSeeker.appliedJobs.filter(jobId => jobId !== req.body.jobId);
        await jobSeeker.save();
        res.status(200).json(jobSeeker);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

}

