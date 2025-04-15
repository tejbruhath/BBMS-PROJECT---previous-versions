const asyncHandler = require('express-async-handler');
const Recipient = require('../models/recipientModel');
const Inventory = require('../models/inventoryModel');

// @desc    Get all recipients
// @route   GET /api/recipients
// @access  Public
const getRecipients = asyncHandler(async (req, res) => {
  const recipients = await Recipient.find({});
  res.json(recipients);
});

// @desc    Get recipient by ID
// @route   GET /api/recipients/:id
// @access  Public
const getRecipientById = asyncHandler(async (req, res) => {
  const recipient = await Recipient.findById(req.params.id);
  
  if (recipient) {
    res.json(recipient);
  } else {
    res.status(404);
    throw new Error('Recipient not found');
  }
});

// @desc    Create a recipient
// @route   POST /api/recipients
// @access  Public
const createRecipient = asyncHandler(async (req, res) => {
  const {
    name,
    age,
    location,
    bloodGroup,
    rhFactor,
    urgency
  } = req.body;

  const recipient = await Recipient.create({
    name,
    age,
    location,
    bloodGroup,
    rhFactor,
    urgency,
    requestDate: new Date()
  });

  if (recipient) {
    res.status(201).json({
      _id: recipient._id,
      name: recipient.name,
      age: recipient.age,
      location: recipient.location,
      bloodGroup: recipient.bloodGroup,
      rhFactor: recipient.rhFactor,
      urgency: recipient.urgency,
      requestDate: recipient.requestDate
    });
  } else {
    res.status(400);
    throw new Error('Invalid recipient data');
  }
});

// @desc    Find matching donors for a recipient
// @route   GET /api/recipients/:id/matches
// @access  Public
const findMatchingDonors = asyncHandler(async (req, res) => {
  const recipient = await Recipient.findById(req.params.id);
  
  if (!recipient) {
    res.status(404);
    throw new Error('Recipient not found');
  }

  // Define blood compatibility matrix
  const compatibilityMatrix = {
    "O-": ["O-"],
    "O+": ["O-", "O+"],
    "A-": ["O-", "A-"],
    "A+": ["O-", "O+", "A-", "A+"],
    "B-": ["O-", "B-"],
    "B+": ["O-", "O+", "B-", "B+"],
    "AB-": ["O-", "A-", "B-", "AB-"],
    "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]
  };

  // Find compatible inventory
  const compatibleInventory = await Inventory.find({
    bloodGroup: { $in: compatibilityMatrix[recipient.bloodGroup] }
  }).populate('donorId');

  // Sort inventory by best match
  const sortedInventory = compatibleInventory.sort((a, b) => {
    // Exact location match gets highest priority
    if (a.location === recipient.location && b.location !== recipient.location) {
      return -1;
    }
    if (a.location !== recipient.location && b.location === recipient.location) {
      return 1;
    }
    
    // Exact blood type match gets next priority
    if (a.bloodGroup === recipient.bloodGroup && b.bloodGroup !== recipient.bloodGroup) {
      return -1;
    }
    if (a.bloodGroup !== recipient.bloodGroup && b.bloodGroup === recipient.bloodGroup) {
      return 1;
    }
    
    // Sort by donation date (fresher blood first)
    return new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime();
  });

  res.json(sortedInventory);
});

module.exports = {
  getRecipients,
  getRecipientById,
  createRecipient,
  findMatchingDonors
}; 