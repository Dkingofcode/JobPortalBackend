const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path
const Job = require('./models/Job'); // Adjust the path

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://kdavidmongoose2001A:mongoPassword@cluster0.xdmae.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing collections
    // await User.deleteMany({});
    await Job.deleteMany({});
    console.log('Cleared User and Job collections');

    // Define locations in UK and US
    const ukCities = ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Bristol', 'Glasgow', 'Belfast', 'Bath', 'York', "Liverpool", "Bournemouth", "Watford", "Brighton", "Leeds", "Sheffield", "Cardiff", "Oxford", "Cambridge", "Nottingham", "Newcastle", "Southampton", "Reading", "Exeter", "Aberdeen", "Dundee", "Inverness", "Stirling", "Perth", "Derry", "Londonderry", "Lisburn", "Newry", "Armagh", "Bangor", "Enniskillen", "Coleraine", "Larne", "Cookstown", "Omagh", "Strabane", "Limavady", "Ballymena", "Antrim", "Downpatrick", "Holywood", "Portrush", "Portstewart", "Ballycastle", "Carrickfergus", "Magherafelt", "Dungannon", "Banbridge", "Craigavon", "Lurgan", "Portadown", "Ards", "Bangor", "Castlereagh", "Newtownards", "Moira", "Donaghadee", "Comber", "Ballygowan", "Hillsborough", "Saintfield", "Crossgar", "Killyleagh", "Downpatrick", "Strangford", "Kircubbin", "Portaferry", "Ballynahinch", "Dromore", "Newcastle", "Rostrevor", "Warrenpoint", "Kilkeel", "Annalong", "Ballymartin", "Castlewellan", "Clough", "Hilltown", "Mayobridge", "Rathfriland", "Aughnacloy", "Ballygawley", "Clogher", "Fivemiletown", "Omagh", "Cookstown", "Dungannon", "Coalisland", "Moy", "Armagh", "Tandragee", "Keady", "Markethill", "Newry", "Warrenpoint", "Rostrevor", "Bessbrook", "Ballymartin", "Kilkeel", "Annalong", "Castlewellan", "Clough", "Hilltown", "Mayobridge", "Rathfriland", "Aughnacloy", "Ballygawley", "Clogher", "Fivemilet"];
    const usCities = ['New York', 'San Francisco', 'Austin', 'Seattle', 'Boston'];
    const techRoles = [
      { title: 'Frontend Developer', description: 'Build and optimize responsive web applications with modern frontend technologies like React and Vue.js.' },
      { title: 'Backend Developer', description: 'Develop scalable server-side applications using Node.js, Express, and MongoDB.' },
      { title: 'Data Scientist', description: 'Analyze and interpret complex datasets to help businesses make data-driven decisions using Python, TensorFlow, and SQL.' },
      { title: 'DevOps Engineer', description: 'Streamline CI/CD pipelines, automate infrastructure management, and ensure platform reliability.' },
      { title: 'Full Stack Developer', description: 'Work on both frontend and backend development to deliver end-to-end web solutions.' },
      { title: 'Product Manager', description: 'Define product roadmaps, gather user requirements, and collaborate with cross-functional teams to deliver high-quality tech products.' },
    ];

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

    // Seed Jobs
    const jobs = Array.from({ length: 50 }, () => {
      const employer = faker.helpers.arrayElement(employersArray);
      const applicant1 = faker.helpers.arrayElement(jobseekersArray);
      const applicant2 = faker.helpers.arrayElement(jobseekersArray);
      const location = faker.helpers.arrayElement([...ukCities, ...usCities]);
      const job = faker.helpers.arrayElement(techRoles);

      return {
        title: job.title,
        description: job.description,
        location,
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
