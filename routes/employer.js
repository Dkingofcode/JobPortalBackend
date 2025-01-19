const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { postCreateJob } = require("../controllers/employer");
const { postEditJob } = require("../controllers/employer");
const { postDeleteJob } = require("../controllers/employer");
const { getApplicants } = require("../controllers/employer");
const { postShortlistApplicant } = require("../controllers/employer");
const { postRejectApplicant } = require("../controllers/employer");


router.post('/job', postCreateJob);
router.put("/job/:id", postEditJob);
router.delete("job/:id", postDeleteJob);
router.get("/job/:id/applicants", getApplicants);
router.post("/job/:jobId/shortlist/:applicantId", postShortlistApplicant);
router.post("/job/:jobId/reject/:applicantId", postRejectApplicant);


module.exports = router;