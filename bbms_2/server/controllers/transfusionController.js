const asyncHandler = require('express-async-handler');
const Transfusion = require('../models/transfusionModel');
const Inventory = require('../models/inventoryModel');
const Blockchain = require('../models/blockchainModel');

// @desc    Get all transfusions
// @route   GET /api/transfusions
// @access  Public
const getTransfusions = asyncHandler(async (req, res) => {
  const transfusions = await Transfusion.find({})
    .populate('donorId', 'name bloodGroup')
    .populate('recipientId', 'name bloodGroup urgency');
    
  res.json(transfusions);
});

// @desc    Get transfusion by ID
// @route   GET /api/transfusions/:id
// @access  Public
const getTransfusionById = asyncHandler(async (req, res) => {
  const transfusion = await Transfusion.findById(req.params.id)
    .populate('donorId', 'name bloodGroup')
    .populate('recipientId', 'name bloodGroup urgency');
  
  if (transfusion) {
    res.json(transfusion);
  } else {
    res.status(404);
    throw new Error('Transfusion not found');
  }
});

// @desc    Create a transfusion
// @route   POST /api/transfusions
// @access  Public
const createTransfusion = asyncHandler(async (req, res) => {
  const {
    donorId,
    recipientId,
    bloodGroup,
    location
  } = req.body;

  const transfusion = await Transfusion.create({
    donorId,
    recipientId,
    bloodGroup,
    location,
    status: 'Pending',
    date: new Date()
  });

  if (transfusion) {
    // Create blockchain record
    await Blockchain.create({
      donorId,
      recipientId,
      transactionType: 'Transfusion',
      status: 'Pending',
      bloodGroup,
      location,
      timestamp: new Date()
    });

    res.status(201).json(transfusion);
  } else {
    res.status(400);
    throw new Error('Invalid transfusion data');
  }
});

// @desc    Update transfusion status
// @route   PUT /api/transfusions/:id
// @access  Public
const updateTransfusionStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  
  const transfusion = await Transfusion.findById(req.params.id);
  
  if (transfusion) {
    transfusion.status = status || transfusion.status;
    transfusion.notes = notes || transfusion.notes;
    
    const updatedTransfusion = await transfusion.save();
    
    // If completed, remove from inventory
    if (status === 'Completed') {
      await Inventory.deleteOne({ donorId: transfusion.donorId });
      
      // Update blockchain record
      await Blockchain.create({
        donorId: transfusion.donorId,
        recipientId: transfusion.recipientId,
        transactionType: 'Transfusion',
        status: 'Valid',
        bloodGroup: transfusion.bloodGroup,
        location: transfusion.location,
        timestamp: new Date()
      });
    }
    
    res.json(updatedTransfusion);
  } else {
    res.status(404);
    throw new Error('Transfusion not found');
  }
});

module.exports = {
  getTransfusions,
  getTransfusionById,
  createTransfusion,
  updateTransfusionStatus
}; 