const express = require('express');
const router = express.Router();
const { 
  getInventory, 
  getInventoryStats,
  getExpiringInventory
} = require('../controllers/inventoryController');

// @route   GET /api/inventory
router.route('/').get(getInventory);

// @route   GET /api/inventory/stats
router.route('/stats').get(getInventoryStats);

// @route   GET /api/inventory/expiring
router.route('/expiring').get(getExpiringInventory);

module.exports = router; 