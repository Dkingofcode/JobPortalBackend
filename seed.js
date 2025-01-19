// const { faker } = require('@faker-js/faker');
// const mongoose = require('mongoose');
// const User = require('./models/User'); // Adjust the path
// const Job = require('./models/Job'); // Adjust the path

// const seedDatabase = async () => {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect('mongodb://localhost:27017/job-portal', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Connected to MongoDB');

//     // Clear existing collections
//     // await User.deleteMany({});
//     await Job.deleteMany({});
//     console.log('Cleared User and Job collections');

//     // Seed Users
//     const jobseekers = Array.from({ length: 50 }, () => ({
//       username: faker.person.fullName(),
//       email: faker.internet.email(),
//       password: faker.internet.password(),
//       role: 'jobseeker',
//     }));

//     const employers = Array.from({ length: 10 }, () => ({
//       username: faker.person.fullName(),
//       email: faker.internet.email(),
//       password: faker.internet.password(),
//       role: 'employer',
//     }));

//     const allUsers = await User.insertMany([...jobseekers, ...employers]);
//     console.log('Users seeded:', allUsers.length);

//     // Separate jobseekers and employers
//     const jobseekersArray = allUsers.filter((user) => user.role === 'jobseeker');
//     const employersArray = allUsers.filter((user) => user.role === 'employer');

//     console.log('Jobseekers:', jobseekersArray.length);
//     console.log('Employers:', employersArray.length);

//     // Validate arrays
//     if (!jobseekersArray.length || !employersArray.length) {
//       throw new Error('Jobseekers or Employers arrays are empty');
//     }

//     // Seed Jobs
//     const jobs = Array.from({ length: 50 }, () => {
//       const employer = faker.helpers.arrayElement(employersArray); // Updated method
//       const applicant1 = faker.helpers.arrayElement(jobseekersArray);
//       const applicant2 = faker.helpers.arrayElement(jobseekersArray);

//       // Debug validation
//       if (!employer || !applicant1 || !applicant2) {
//         console.error('Invalid data:', { employer, applicant1, applicant2 });
//         throw new Error('Employer or applicant is undefined');
//       }

//       return {
//         title: faker.person.jobTitle(),
//         description: faker.lorem.paragraph(),
//         location: faker.location.city(),
//         salary: faker.number.int({ min: 30000, max: 150000 }),
//         datePosted: faker.date.past(),
//         postedBy: employer._id,
//         applicants: [applicant1._id, applicant2._id],
//       };
//     });

//     await Job.insertMany(jobs);
//     console.log('Jobs seeded:', jobs.length);

//     // Disconnect
//     mongoose.disconnect();
//     console.log('Database seeding completed and disconnected');
//   } catch (error) {
//     console.error('Error seeding database:', error);
//     mongoose.disconnect();
//   }
// };

// seedDatabase();


const mongoose = require('mongoose');
const Job = require('./models/Job'); // Adjust the path to your Job model
const Company = require('./models/Company'); // Adjust the path to your Company model

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const company = await Company.findOne({ name: 'TechCorp' });
    if (!company) {
      console.log('Company not found. Please create a company first.');
      return;
    }

    const jobs = [
      {
        title: 'Frontend Developer',
        description: 'Develop and maintain user interfaces for web applications.',
        requirements: ['React', 'JavaScript', 'CSS', 'HTML'],
        salary: 60000,
        location: 'New York, USA',
        jobType: 'Full-Time',
        experienceLevel: 'Mid-Level',
        position: 'Frontend Developer',
        company: company._id,
        created_by: 'someUserId', // Replace with a valid user ID
      },
      {
        title: 'Backend Developer',
        description: 'Build and maintain server-side application logic.',
        requirements: ['Node.js', 'Express', 'MongoDB'],
        salary: 75000,
        location: 'San Francisco, USA',
        jobType: 'Full-Time',
        experienceLevel: 'Senior',
        position: 'Backend Developer',
        company: company._id,
        created_by: 'someUserId', // Replace with a valid user ID
      },
      
{
  title: "Data Scientist",
  Requirements: ["Python, TensorFlow, SQL, Big Data"]
  salary: 55,000,
  location: "Manchester, UK",
  jobType: "Full-Time"
  experienceLevel: "Senior",
  position: "Data Scientist",
  company: company._id,
  
  
},

{
Data Scientist - Manchester,
Requirements: "Python, TensorFlow, SQL, Big Data"
Salary: £55,000 - £75,000
Location: "Manchester, UK"
Job Type: "Full-Time"
Experience: "Senior"

}
    
    ];

    await Job.insertMany(jobs);
    console.log('Jobs seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding jobs:', error);
    process.exit(1);
  }
};

seedJobs();
