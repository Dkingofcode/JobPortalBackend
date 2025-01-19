const express = require('express');
const Job = require('../models/Job'); // Assuming you have a Job model


module.exports = {

// Get all jobs
getAllJobs: async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        // console.log(jobs);

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
},

// Get a job by ID
getJobById: async (req, res) => {
    try {
        const { jobTitle, location } = req.query;

        // Ensure at least one query parameter is provided
        if (!jobTitle && !location) {
            return res.status(400).json({ msg: "Bad request" });
        }

        // Dynamically build the query
        const query = {};
        if (jobTitle) query.title = { $regex: new RegExp(jobTitle, "i") };
        if (location) query.location = { $regex: new RegExp(location, "i") };

        const job = await Job.find(query).populate({
            path: "applications",
        });

        // Check if no jobs were found
        if (job.length === 0) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.error("Error fetching job:", error);
        return res.status(500).json({ msg: "Server error" });
    }
},

// // Search Jobs Or Get Jobs by Geographical Location
// getJobByLocation: async (req, res) => {
//     const { location } = req.query;

//     try {
//         const jobs = await Job.find
//             ({ location: { $regex: location, $options: 'i' } });
//         res.send(jobs);
//     } catch (error) {
//         res.status(500).send();
//     }
// },

getEmployerJobs: async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: "company",
            createdAt: -1
        })

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
},


// Get all jobs by a company
getJobByCompanyId: async (req, res) => {
    try {
        const companyId = req.params.id;
        // console.log(companyId);

        const jobs = await Job.find({ company: companyId });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "Jobs not found for the given company",
                success: false,
            });
        }

        return res.status(200).json({
            jobs,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}


// // Search Jobs by Job Title
// getJobByTitle: async (req, res) => {
//     const { title } = req.query;

//     try {
//         const jobs = await Job.find
//             ({ title: { $regex: title, $options: 'i' } });
//         res.send(jobs);
//     } catch (error) {
//         res.status(500).send();
//     }
// },


// // Search Jobs by Company Name
// getJobByCompanyName: async (req, res) => {
//     const { company } = req.query;

//     try {
//         const jobs = await Job.find
//             ({ company: { $regex: company, $options: 'i' } });
//         res.send(jobs);
//     } catch (error) {
//         res.status(500).send();
//     }
// },

// // Search Jobs by Job Type
// getJobBySearchType: async (req, res) => {

//     const { type } = req.query;

//     try {
//         const jobs = await Job.find
//             ({ type: { $regex: type, $options: 'i' } });
//         res.send(jobs);
//     }
//     catch (error) {
//         res.status(500).send();
//     }
// }
}





