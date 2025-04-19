const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Donor = require('../models/donorModel');
const Recipient = require('../models/recipientModel');
const Inventory = require('../models/inventoryModel');
const Transfusion = require('../models/transfusionModel');
const Blockchain = require('../models/blockchainModel');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(err => {
  console.error('Connection error:', err.message);
  process.exit(1);
});

// Clear all existing data
const clearDatabase = async () => {
  try {
    await Blockchain.deleteMany({});
    await Transfusion.deleteMany({});
    await Inventory.deleteMany({});
    await Recipient.deleteMany({});
    await Donor.deleteMany({});
    
    console.log('Database cleared');
    return true;
  } catch (error) {
    console.error('Error clearing database:', error);
    return false;
  }
};

// Create a sample donor
const createSampleDonor = async () => {
  try {
    // Create a donor
    const donor = new Donor({
      name: 'John Doe',
      age: 35,
      location: 'Memorial Hospital',
      bloodGroup: 'O+',
      rhFactor: 'Positive',
      isSmoker: false,
      isAlcoholConsumer: false,
      smokingConsent: true,
      alcoholConsent: true,
      donationDate: new Date()
    });
    
    const savedDonor = await donor.save();
    console.log('Sample donor created:', savedDonor._id);
    
    // Create inventory entry
    const donationDate = new Date();
    const expiryDate = new Date(donationDate);
    expiryDate.setDate(donationDate.getDate() + 42);
    
    const inventory = new Inventory({
      donorId: savedDonor._id,
      bloodGroup: 'O+',
      rhFactor: 'Positive',
      location: 'Memorial Hospital',
      donationDate,
      expiryDate
    });
    
    const savedInventory = await inventory.save();
    console.log('Sample inventory entry created');
    
    // Create blockchain record
    const blockchain = new Blockchain({
      donorId: savedDonor._id,
      transactionType: 'Donation',
      status: 'Valid',
      bloodGroup: 'O+',
      location: 'Memorial Hospital',
      timestamp: donationDate
    });
    
    const savedBlockchain = await blockchain.save();
    console.log('Sample blockchain record created');
    
    return savedDonor;
  } catch (error) {
    console.error('Error creating sample donor:', error);
    return null;
  }
};

// Create a sample recipient
const createSampleRecipient = async () => {
  try {
    const recipient = new Recipient({
      name: 'Jane Smith',
      age: 42,
      location: 'City Medical Center',
      bloodGroup: 'A+',
      rhFactor: 'Positive',
      urgency: 'Medium',
      requestDate: new Date()
    });
    
    const savedRecipient = await recipient.save();
    console.log('Sample recipient created:', savedRecipient._id);
    return savedRecipient;
  } catch (error) {
    console.error('Error creating sample recipient:', error);
    return null;
  }
};

// Create a sample transfusion
const createSampleTransfusion = async (donorId, recipientId) => {
  try {
    if (!donorId || !recipientId) {
      console.log('Missing donor or recipient ID, skipping transfusion creation');
      return null;
    }
    
    const transfusion = new Transfusion({
      donorId,
      recipientId,
      status: 'Pending',
      date: new Date(),
      bloodGroup: 'O+',
      location: 'City Medical Center'
    });
    
    const savedTransfusion = await transfusion.save();
    console.log('Sample transfusion created:', savedTransfusion._id);
    
    // Create blockchain record for transfusion
    const blockchain = new Blockchain({
      donorId,
      recipientId,
      transactionType: 'Transfusion',
      status: 'Pending',
      bloodGroup: 'O+',
      location: 'City Medical Center',
      timestamp: new Date()
    });
    
    await blockchain.save();
    console.log('Sample transfusion blockchain record created');
    
    return savedTransfusion;
  } catch (error) {
    console.error('Error creating sample transfusion:', error);
    return null;
  }
};

// Run the initialization
const initializeDatabase = async () => {
  try {
    const cleared = await clearDatabase();
    if (!cleared) {
      console.log('Failed to clear database, aborting initialization');
      process.exit(1);
    }
    
    // Create basic sample data
    const donor = await createSampleDonor();
    const recipient = await createSampleRecipient();
    
    if (donor && recipient) {
      await createSampleTransfusion(donor._id, recipient._id);
    }
    
    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Start the initialization process
initializeDatabase(); 