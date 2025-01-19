const mongoose =  require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    }, email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['jobseeker', 'employer'],
    
    },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: { type: String },//URL to resume file
        resumeOriginalName: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: {
            type: String,
            default: ""
        }
    }
}, { timestamps: true });
  module.exports = mongoose.model('User', userSchema);