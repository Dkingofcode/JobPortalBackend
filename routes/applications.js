const express  = require("express");
const isAuthenticated  = require("../middlewares/isAuthenticated.js").isAuthenticated;
const { applyjob, getApplicants, getAppliedJobs, updateStatus }  = require("../controllers/application.js");


const router = express.Router();
router.get("/apply/:id",isAuthenticated, applyjob);
router.get("/appliedJobs", isAuthenticated, getAppliedJobs);
router.get("/:id/applicants", isAuthenticated, getApplicants);
router.post("/status/:id/update", isAuthenticated, updateStatus);


 module.exports = router;