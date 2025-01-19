const  Company  = require("../models/company");
//import getDataUri from "../utils/datauri.js";
//import cloudinary from "../utils/cloudinary.js";
const User = require("../models/User");

module.exports = {

//678cead71e50a1e55aefc8e9

//678d0cb4b05256d20f2d94bf

 registerCompany: async (req, res) => {
    try {
        const { companyName, email } = req.body;
        console.log(req.body);
        console.log(companyName);
         console.log(email);
        const user = await User.findOne({ email });
        console.log(user);
         const Userid= user.id;

        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false,
            });
        }

        let company = await Company.findOne({ name: companyName, userId: Userid });
        if (company) {
            return res.status(400).json({
                message: "You can't register the same company.",
                success: false,
            });
        }

        company = await Company.create({
            name: companyName,
            userId: req.id, // Ensure req.id is set in your middleware
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true,
        });
    } catch (error) {
        console.error(error);

    }
},

//  getCompany: async (req, resp) => {
//     try {
//         const userId = req.id;// logged in user id
//         const companies = await Company.find({ userId: userId });
//         if (!companies) {
//             return resp.status(404).json({
//                 messsage: "companies not found",
//                 success: false
//             });
//         }
//         return resp.status(200).json({
//             companies,
//             success: true
//         })

//     } catch (error) {
//         console.log(error);

//     }
// },

getCompanyById: async (req, resp) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return resp.status(404).json({
                messsage: "company not found.",
                success: false
            });
        }
        return resp.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
},

 updateCompany: async (req, resp) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file;

        // idhar cloudnary aayega
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;

        const updateData = { name, description, website, location, logo };

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!company) {
            return resp.status(404).json({
                messsage: "company not found.",
                success: false
            });
        }
        return resp.status(200).json({
            messsage: "company information updated..",
            success: true
        });
    } catch (error) {
        console.log(error);

    }
},

 getAllCompanies: async (req, resp) => {
    try {
        const companies = await Company.find();
        if (!companies || companies.length === 0) {
            return resp.status(404).json({
                message: "No companies found.",
                success: false,
            });
        }
        return resp.status(200).json({
            companies,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return resp.status(500).json({
            message: "Internal server error while fetching companies.",
            success: false,
        });
    }
}

}

