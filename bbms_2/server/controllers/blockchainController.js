const asyncHandler = require('express-async-handler');
const Blockchain = require('../models/blockchainModel');
const Inventory = require('../models/inventoryModel');

// @desc    Get all blockchain records
// @route   GET /api/blockchain
// @access  Public
const getBlockchain = asyncHandler(async (req, res) => {
  const blockchain = await Blockchain.find({})
    .populate('donorId', 'name bloodGroup')
    .populate('recipientId', 'name bloodGroup')
    .sort({ timestamp: -1 });
    
  res.json(blockchain);
});

// @desc    Get blockchain records by donor ID
// @route   GET /api/blockchain/donor/:donorId
// @access  Public
const getBlockchainByDonorId = asyncHandler(async (req, res) => {
  const blockchain = await Blockchain.find({ donorId: req.params.donorId })
    .populate('donorId', 'name bloodGroup')
    .populate('recipientId', 'name bloodGroup')
    .sort({ timestamp: -1 });
    
  res.json(blockchain);
});

// @desc    Verify blood unit
// @route   POST /api/blockchain/verify
// @access  Public
const verifyBloodUnit = asyncHandler(async (req, res) => {
  const { donorId } = req.body;
  
  // Find donation record
  const donationRecord = await Blockchain.findOne({
    donorId,
    transactionType: 'Donation',
    status: 'Valid'
  });
  
  // Find transfusion record
  const transfusionRecord = await Blockchain.findOne({
    donorId,
    transactionType: 'Transfusion',
    status: 'Valid'
  });
  
  // If there's a donation but no transfusion, the unit should still be in inventory
  const shouldBeInInventory = !!donationRecord && !transfusionRecord;
  
  // Check if it's actually in inventory
  const isInInventory = await Inventory.exists({ donorId });
  
  // Create verification record
  const blockchain = await Blockchain.create({
    donorId,
    transactionType: 'Verification',
    status: shouldBeInInventory === !!isInInventory ? 'Valid' : 'Invalid',
    bloodGroup: donationRecord ? donationRecord.bloodGroup : 'O+', // Fallback
    location: 'System',
    timestamp: new Date()
  });
  
  res.json({
    verified: shouldBeInInventory === !!isInInventory,
    blockchain
  });
});

module.exports = {
  getBlockchain,
  getBlockchainByDonorId,
  verifyBloodUnit
}; 