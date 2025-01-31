const express = require('express');
const mongoose = require('mongoose');
const jobseekerRoutes = require('./routes/jobseeker');
const employerRoutes = require('./routes/employer');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const profileRoutes = require('./routes/profile');
const companyRoutes = require("./routes/company");
const { HfInference } = require("@huggingface/inference");


const cors = require('cors');

const client = new HfInference("hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

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
    'https://job-portal-theta-inky.vercel.app' // Vercel deployment
  ];
  
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Allowed methods
    allowedHeaders: 'Content-Type,Authorization', // Allowed headers
    credentials: true // Allow cookies
  }));
  
  // Handle preflight requests
  app.options('*', cors());
  
// Or simply:
// app.use(cors()); // Enables CORS for all origins (use this for development only)




app.use('/api/jobseeker', jobseekerRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api', jobRoutes);
app.use('/api', applicationRoutes);
app.use('/api', profileRoutes);
app.use('/api', companyRoutes);
app.use('/api', authRoutes);



app.listen(process.env.PORT || 8000, () => console.log('Server running on http://localhost:8000'));