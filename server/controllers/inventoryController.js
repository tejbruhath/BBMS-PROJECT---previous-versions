const asyncHandler = require('express-async-handler');
const Inventory = require('../models/inventoryModel');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Public
const getInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find({}).populate('donorId', 'name bloodGroup rhFactor');
  res.json(inventory);
});

// @desc    Get inventory stats by blood group
// @route   GET /api/inventory/stats
// @access  Public
const getInventoryStats = asyncHandler(async (req, res) => {
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  const stats = {};
  
  // Get counts for each blood group
  await Promise.all(
    bloodGroups.map(async (group) => {
      const count = await Inventory.countDocuments({ bloodGroup: group });
      stats[group] = count;
    })
  );
  
  // Get total count
  stats.total = await Inventory.countDocuments();
  
  // Get expiring soon (within 7 days)
  const today = new Date();
  const oneWeekLater = new Date(today);
  oneWeekLater.setDate(today.getDate() + 7);
  
  stats.expiringSoon = await Inventory.countDocuments({
    expiryDate: { $gt: today, $lt: oneWeekLater }
  });
  
  res.json(stats);
});

// @desc    Get expiring inventory items
// @route   GET /api/inventory/expiring
// @access  Public
const getExpiringInventory = asyncHandler(async (req, res) => {
  const today = new Date();
  const twoWeeksLater = new Date(today);
  twoWeeksLater.setDate(today.getDate() + 14);
  
  const expiringItems = await Inventory.find({
    expiryDate: { $gt: today, $lt: twoWeeksLater }
  }).populate('donorId', 'name bloodGroup');
  
  res.json(expiringItems);
});

module.exports = {
  getInventory,
  getInventoryStats,
  getExpiringInventory
}; 