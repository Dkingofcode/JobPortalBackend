const express = require('express');
const Job = require('../models/Job'); // Assuming you have a Job model
require('dotenv').config();
//const express = require('express');
const bcrypt = require('bcryptjs');
//const User = require('../models/User'); // Assuming you have a User model defined
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const sendOtp = require('../utils/sendOtp');
const NodeCache = require('node-cache');
const otpCache = new NodeCache({ stdTTL: 300, checkperiod: 600 });
const user = require('../models/User');
const company = require("../models/company");

const Employer = user.findOne({ role: 'employer' });

//const router = express.Router();

module.exports = {

// Create a new job
 postCreateJob: async (req, res) => {
 try {
    const { title, description, requirements, salary, location, jobType, experience, position, companyName} = req.body;
    
    const userId = req.id;
    const companyId = await  company.findOne({ name: companyName })
    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position ) {
    return res.status(400).json({
         message: 'Please fill all fields' 
    })
};

if(!companyId){
 return res.status(400).json({
    message: "Register your company"
 })   
}

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(','),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId,
        });
        return res.status(201).json({
            message: 'Job created successfully',
            job,
            success: true
        });
    } catch (error) {
        res.status(400).send(error);
    }
},

// Edit an existing job
  postEditJob:  async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!job) {
            return res.status(404).send();
        }
        res.send(job);
    } catch (error) {
        res.status(400).send(error);
    }
},

// Delete a job
   postDeleteJob: async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).send();
        }
        res.send(job);
    } catch (error) {
        res.status(500).send(error);
    }
},

// Get all applicants
  getApplicants: async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        await job.populate('applicants').execPopulate();
        res.send(job.applicants);
    } catch (error) {
        res.status(500).send(error);
    }
},

// Shortlist an applicant
  postShortlistApplicant: async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).send();
        }
        job.shortlisted.push(req.params.applicantId);
        await job.save();
        res.send(job);
    } catch (error) {
        res.status(500).send(error);
    }
},

// Reject an applicant

 postRejectApplicant:  async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).send();
        }
        job.rejected.push(req.params.applicantId);
        await job.save();
        res.send(job);
    } catch (error) {
        res.status(500).send(error);
    }
 },

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
       const updatedProfile = await Employer.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
        const deletedProfile = await Employer.findByIdAndDelete(req.params.id);
        if (!deletedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
},


};



