const express = require('express');
const router = express.Router();
const { 
  getDonors, 
  getDonorById, 
  createDonor 
} = require('../controllers/donorController');

// @route   GET /api/donors
// @route   POST /api/donors
router.route('/').get(getDonors).post(createDonor);

// @route   GET /api/donors/:id
router.route('/:id').get(getDonorById);

module.exports = router; 