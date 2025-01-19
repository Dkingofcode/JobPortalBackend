const express = require('express');
const mongoose = require('mongoose');
const jobseekerRoutes = require('./routes/jobseeker');
const employerRoutes = require('./routes/employer');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const profileRoutes = require('./routes/profile');
const companyRoutes = require("./routes/company");

const cors = require('cors');

const app = express();
app.use(express.json());


const dbURI = process.env.MONGO_URI_TEST;

 
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

const allowedOrigins = [
     // local development
    'https://job-portal-theta-inky.vercel.app' // Vercel deployment
];

// Enable CORS for all origins
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins(origin)){
            callback(null, true);
        }else{
            callback(new Error('Origin not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Allowed methods
    allowedHeaders: 'Content-Type,Authorization', // Allowed headers
    credentials: true // Allow cookies
}));

// Or simply:
// app.use(cors()); // Enables CORS for all origins (use this for development only)


app.use('/api/jobseeker', jobseekerRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api', jobRoutes);
app.use('/api', applicationRoutes);
app.use('/api', profileRoutes);
app.use('/api', companyRoutes);
app.use('/api', authRoutes);



app.listen(8000, () => console.log('Server running on http://localhost:8000'));