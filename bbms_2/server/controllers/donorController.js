const asyncHandler = require('express-async-handler');
const Donor = require('../models/donorModel');
const Inventory = require('../models/inventoryModel');
const Blockchain = require('../models/blockchainModel');

// @desc    Get all donors
// @route   GET /api/donors
// @access  Public
const getDonors = asyncHandler(async (req, res) => {
  const donors = await Donor.find({});
  res.json(donors);
});

// @desc    Get donor by ID
// @route   GET /api/donors/:id
// @access  Public
const getDonorById = asyncHandler(async (req, res) => {
  const donor = await Donor.findById(req.params.id);
  
  if (donor) {
    res.json(donor);
  } else {
    res.status(404);
    throw new Error('Donor not found');
  }
});

// @desc    Create a donor
// @route   POST /api/donors
// @access  Public
const createDonor = asyncHandler(async (req, res) => {
  const {
    name,
    age,
    location,
    bloodGroup,
    rhFactor,
    isSmoker,
    isAlcoholConsumer,
    smokingConsent,
    alcoholConsent
  } = req.body;

  const donor = await Donor.create({
    name,
    age,
    location,
    bloodGroup,
    rhFactor,
    isSmoker,
    isAlcoholConsumer,
    smokingConsent,
    alcoholConsent,
    donationDate: new Date()
  });

  if (donor) {
    // Create inventory entry
    const donationDate = new Date();
    const expiryDate = new Date(donationDate);
    expiryDate.setDate(expiryDate.getDate() + 42); // 42 days expiry

    const inventory = await Inventory.create({
      donorId: donor._id,
      bloodGroup,
      rhFactor,
      location,
      donationDate,
      expiryDate
    });

    // Create blockchain record
    const blockchain = await Blockchain.create({
      donorId: donor._id,
      transactionType: 'Donation',
      status: 'Valid',
      bloodGroup,
      location,
      timestamp: new Date()
    });

    res.status(201).json({
      _id: donor._id,
      name: donor.name,
      age: donor.age,
      location: donor.location,
      bloodGroup: donor.bloodGroup,
      rhFactor: donor.rhFactor,
      isSmoker: donor.isSmoker,
      isAlcoholConsumer: donor.isAlcoholConsumer,
      donationDate: donor.donationDate
    });
  } else {
    res.status(400);
    throw new Error('Invalid donor data');
  }
});

module.exports = {
  getDonors,
  getDonorById,
  createDonor
}; 