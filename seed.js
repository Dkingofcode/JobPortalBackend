const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path
const Job = require('./models/Job'); // Adjust the path

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/job-portal', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing collections
    // await User.deleteMany({});
    await Job.deleteMany({});
    console.log('Cleared User and Job collections');

    // Seed Users
    const jobseekers = Array.from({ length: 50 }, () => ({
      username: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: 'jobseeker',
    }));

    const employers = Array.from({ length: 10 }, () => ({
      username: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: 'employer',
    }));

    const allUsers = await User.insertMany([...jobseekers, ...employers]);
    console.log('Users seeded:', allUsers.length);

    // Separate jobseekers and employers
    const jobseekersArray = allUsers.filter((user) => user.role === 'jobseeker');
    const employersArray = allUsers.filter((user) => user.role === 'employer');

    console.log('Jobseekers:', jobseekersArray.length);
    console.log('Employers:', employersArray.length);

    // Validate arrays
    if (!jobseekersArray.length || !employersArray.length) {
      throw new Error('Jobseekers or Employers arrays are empty');
    }

    // Seed Jobs
    const jobs = Array.from({ length: 50 }, () => {
      const employer = faker.helpers.arrayElement(employersArray); // Updated method
      const applicant1 = faker.helpers.arrayElement(jobseekersArray);
      const applicant2 = faker.helpers.arrayElement(jobseekersArray);

      // Debug validation
      if (!employer || !applicant1 || !applicant2) {
        console.error('Invalid data:', { employer, applicant1, applicant2 });
        throw new Error('Employer or applicant is undefined');
      }

      return {
        title: faker.person.jobTitle(),
        description: faker.lorem.paragraph(),
        location: faker.location.city(),
        salary: faker.number.int({ min: 30000, max: 150000 }),
        datePosted: faker.date.past(),
        postedBy: employer._id,
        applicants: [applicant1._id, applicant2._id],
      };
    });

    await Job.insertMany(jobs);
    console.log('Jobs seeded:', jobs.length);

    // Disconnect
    mongoose.disconnect();
    console.log('Database seeding completed and disconnected');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.disconnect();
  }
};

seedDatabase();
