const express  =  require("express");
const isAuthenticated = require("../middlewares/isAuthenticated.js");
const { getAllCompanies, getCompany, getCompanyById, registerCompany, updateCompany } = require("../controllers/company.js");
//const { singleUpload } = require("../middlewares/multer.js");

const router = express.Router();

router.post("/company",  registerCompany);
//router.get("/company",  getCompany);
router.get("/company/:id", getCompanyById);
router.put("/company/:id",  updateCompany);
router.get("/allCompanies",getAllCompanies);


module.exports = router;