const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Donor = require('../models/donorModel');
const Recipient = require('../models/recipientModel');
const Inventory = require('../models/inventoryModel');
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

// Sample donor data
const donors = [
  {
    name: 'Robert Johnson',
    age: 28,
    location: 'Memorial Hospital',
    bloodGroup: 'A+',
    rhFactor: 'Positive',
    isSmoker: false,
    isAlcoholConsumer: true,
    smokingConsent: true,
    alcoholConsent: true
  },
  {
    name: 'Emily Wilson',
    age: 32,
    location: 'University Hospital',
    bloodGroup: 'B-',
    rhFactor: 'Negative',
    isSmoker: false,
    isAlcoholConsumer: false,
    smokingConsent: true,
    alcoholConsent: true
  },
  {
    name: 'Michael Chen',
    age: 45,
    location: 'City Medical Center',
    bloodGroup: 'O-',
    rhFactor: 'Negative',
    isSmoker: true,
    isAlcoholConsumer: false,
    smokingConsent: true,
    alcoholConsent: true
  },
  {
    name: 'Sarah Patel',
    age: 29,
    location: 'Community Clinic',
    bloodGroup: 'AB+',
    rhFactor: 'Positive',
    isSmoker: false,
    isAlcoholConsumer: false,
    smokingConsent: true,
    alcoholConsent: true
  },
  {
    name: 'David Rodriguez',
    age: 39,
    location: 'Regional Medical Center',
    bloodGroup: 'A-',
    rhFactor: 'Negative',
    isSmoker: false,
    isAlcoholConsumer: true,
    smokingConsent: true,
    alcoholConsent: true
  }
];

// Sample recipient data
const recipients = [
  {
    name: 'Linda Thompson',
    age: 52,
    location: 'Memorial Hospital',
    bloodGroup: 'AB+',
    rhFactor: 'Positive',
    urgency: 'High'
  },
  {
    name: 'James Wilson',
    age: 67,
    location: 'University Hospital',
    bloodGroup: 'O+',
    rhFactor: 'Positive',
    urgency: 'Critical'
  },
  {
    name: 'Maria Gonzalez',
    age: 19,
    location: 'City Medical Center',
    bloodGroup: 'B+',
    rhFactor: 'Positive',
    urgency: 'Medium'
  },
  {
    name: 'Thomas Lee',
    age: 48,
    location: 'Regional Medical Center',
    bloodGroup: 'A-',
    rhFactor: 'Negative',
    urgency: 'Low'
  }
];

// Add a donor with inventory and blockchain entry
const addDonor = async (donorData) => {
  try {
    // Create donor
    const donationDate = new Date();
    donationDate.setDate(donationDate.getDate() - Math.floor(Math.random() * 20));
    
    const donor = new Donor({
      ...donorData,
      donationDate
    });
    
    const savedDonor = await donor.save();
    console.log(`Donor created: ${savedDonor.name} (${savedDonor._id})`);
    
    // Create inventory entry
    const expiryDate = new Date(donationDate);
    expiryDate.setDate(donationDate.getDate() + 42);
    
    const inventory = new Inventory({
      donorId: savedDonor._id,
      bloodGroup: donorData.bloodGroup,
      rhFactor: donorData.rhFactor,
      location: donorData.location,
      donationDate,
      expiryDate
    });
    
    await inventory.save();
    
    // Create blockchain record
    const blockchain = new Blockchain({
      donorId: savedDonor._id,
      transactionType: 'Donation',
      status: 'Valid',
      bloodGroup: donorData.bloodGroup,
      location: donorData.location,
      timestamp: donationDate
    });
    
    await blockchain.save();
    
    return savedDonor;
  } catch (error) {
    console.error(`Error adding donor ${donorData.name}:`, error);
    return null;
  }
};

// Add a recipient
const addRecipient = async (recipientData) => {
  try {
    const requestDate = new Date();
    requestDate.setDate(requestDate.getDate() - Math.floor(Math.random() * 10));
    
    const recipient = new Recipient({
      ...recipientData,
      requestDate
    });
    
    const savedRecipient = await recipient.save();
    console.log(`Recipient created: ${savedRecipient.name} (${savedRecipient._id})`);
    
    return savedRecipient;
  } catch (error) {
    console.error(`Error adding recipient ${recipientData.name}:`, error);
    return null;
  }
};

// Add all data to database
const addAllData = async () => {
  try {
    // Add donors
    const createdDonors = [];
    for (const donorData of donors) {
      const donor = await addDonor(donorData);
      if (donor) createdDonors.push(donor);
    }
    
    // Add recipients
    const createdRecipients = [];
    for (const recipientData of recipients) {
      const recipient = await addRecipient(recipientData);
      if (recipient) createdRecipients.push(recipient);
    }
    
    console.log('Additional sample data added successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample data:', error);
    process.exit(1);
  }
};

// Run the script
addAllData(); 