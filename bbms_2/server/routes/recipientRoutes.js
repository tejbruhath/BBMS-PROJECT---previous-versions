const express = require('express');
const router = express.Router();
const { 
  getRecipients, 
  getRecipientById, 
  createRecipient,
  findMatchingDonors
} = require('../controllers/recipientController');

// @route   GET /api/recipients
// @route   POST /api/recipients
router.route('/').get(getRecipients).post(createRecipient);

// @route   GET /api/recipients/:id
router.route('/:id').get(getRecipientById);

// @route   GET /api/recipients/:id/matches
router.route('/:id/matches').get(findMatchingDonors);

module.exports = router; 