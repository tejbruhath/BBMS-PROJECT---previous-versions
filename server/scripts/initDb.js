const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Donor = require('../models/donorModel');
const Recipient = require('../models/recipientModel');
const Inventory = require('../models/inventoryModel');
const Transfusion = require('../models/transfusionModel');
const Blockchain = require('../models/blockchainModel');

// Load env vars
dotenv.config({ path: '../.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bloodlink-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Helper functions to generate sample data
const getRandomBloodGroup = () => {
  const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  return groups[Math.floor(Math.random() * groups.length)];
};

const getRandomRhFactor = () => {
  return Math.random() > 0.5 ? "Positive" : "Negative";
};

const getRandomLocation = () => {
  const locations = ["Memorial Hospital", "City Medical Center", "University Hospital", "Community Clinic", "Regional Medical Center"];
  return locations[Math.floor(Math.random() * locations.length)];
};

const getRandomRecentDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date;
};

const getExpiryDate = (donationDate) => {
  const date = new Date(donationDate);
  date.setDate(date.getDate() + 42); // Blood typically expires after 42 days
  return date;
};

const clearDatabase = async () => {
  try {
    await Blockchain.deleteMany({});
    await Transfusion.deleteMany({});
    await Inventory.deleteMany({});
    await Recipient.deleteMany({});
    await Donor.deleteMany({});

    console.log('Database cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

// Create donors and inventory - Fixed to avoid parallel saves
const createDonors = async (count) => {
  try {
    const donors = [];
    
    // First create all donors and save them
    for (let i = 0; i < count; i++) {
      const bloodGroup = getRandomBloodGroup();
      const rhFactor = getRandomRhFactor();
      const location = getRandomLocation();
      const donationDate = getRandomRecentDate();

      const donor = new Donor({
        name: `Donor ${i + 1}`,
        age: 20 + Math.floor(Math.random() * 40), // Age between 20 and 60
        location,
        bloodGroup,
        rhFactor,
        isSmoker: Math.random() > 0.7,
        isAlcoholConsumer: Math.random() > 0.6,
        smokingConsent: true,
        alcoholConsent: true,
        donationDate
      });

      donors.push(await donor.save());
    }

    console.log(`${donors.length} donors created`);

    // Create inventory and blockchain for each donor
    for (const donor of donors) {
      // Create inventory entry
      const inventory = new Inventory({
        donorId: donor._id,
        bloodGroup: donor.bloodGroup,
        rhFactor: donor.rhFactor,
        location: donor.location,
        donationDate: donor.donationDate,
        expiryDate: getExpiryDate(donor.donationDate)
      });
      
      await inventory.save();

      // Create blockchain record
      const blockchain = new Blockchain({
        donorId: donor._id,
        transactionType: 'Donation',
        status: 'Valid',
        bloodGroup: donor.bloodGroup,
        location: donor.location,
        timestamp: donor.donationDate
      });
      
      await blockchain.save();
    }

    console.log(`Inventory and blockchain records created for ${donors.length} donors`);
    return donors;
  } catch (error) {
    console.error('Error creating donors:', error);
    process.exit(1);
  }
};

// Create recipients
const createRecipients = async (count) => {
  try {
    const recipientsData = [];

    for (let i = 0; i < count; i++) {
      const urgencyLevels = ["Low", "Medium", "High", "Critical"];
      
      const recipient = new Recipient({
        name: `Recipient ${i + 1}`,
        age: 20 + Math.floor(Math.random() * 60), // Age between 20 and 80
        location: getRandomLocation(),
        bloodGroup: getRandomBloodGroup(),
        rhFactor: getRandomRhFactor(),
        urgency: urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)],
        requestDate: getRandomRecentDate()
      });

      recipientsData.push(await recipient.save());
    }

    console.log(`${recipientsData.length} recipients created`);
    return recipientsData;
  } catch (error) {
    console.error('Error creating recipients:', error);
    process.exit(1);
  }
};

// Create transfusions
const createTransfusions = async (donors, recipients, count) => {
  try {
    const statuses = ["Pending", "Completed", "Failed", "Requesting Additional"];
    const min = Math.min(donors.length, recipients.length, count);
    const transfusionsData = [];

    for (let i = 0; i < min; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const date = getRandomRecentDate();
      
      const transfusion = new Transfusion({
        donorId: donors[i]._id,
        recipientId: recipients[i]._id,
        status,
        date,
        bloodGroup: donors[i].bloodGroup,
        location: recipients[i].location
      });

      transfusionsData.push(await transfusion.save());

      // Create blockchain record for transfusion
      const blockchain = new Blockchain({
        donorId: donors[i]._id,
        recipientId: recipients[i]._id,
        transactionType: 'Transfusion',
        status: status === 'Completed' ? 'Valid' : 'Pending',
        bloodGroup: donors[i].bloodGroup,
        location: recipients[i].location,
        timestamp: date
      });

      await blockchain.save();
    }

    console.log(`${transfusionsData.length} transfusions created with blockchain records`);
    return transfusionsData;
  } catch (error) {
    console.error('Error creating transfusions:', error);
    process.exit(1);
  }
};

// Main function to seed the database
const seedDatabase = async () => {
  try {
    await clearDatabase();
    const donors = await createDonors(15);
    const recipients = await createRecipients(10);
    await createTransfusions(donors, recipients, 5);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase(); 