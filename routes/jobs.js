const express = require('express');
const router = express.Router();



const { getAllJobs } = require("../controllers/jobs");
const { getJobById } = require("../controllers/jobs");
const { getEmployerJobs } = require("../controllers/jobs");
const { getJobByCompanyId } = require("../controllers/jobs");



router.get("/jobs", getAllJobs);
router.get('/jobs/view', getJobById);
router.get('/employerjobs', getEmployerJobs);
router.get('/jobs/company/:id', getJobByCompanyId);

// router.get('/jobs/search', getJobByLocation);
// router.get('/jobs/search/company', getJobByCompanyName);
// router.get('/jobs/search/title', getJobByTitle);
// router.get('/jobs/search/type', getJobBySearchType);


module.exports = router;

