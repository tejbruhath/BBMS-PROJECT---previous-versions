const express = require('express');
const router = express.Router();
const { 
  getBlockchain,
  getBlockchainByDonorId,
  verifyBloodUnit
} = require('../controllers/blockchainController');

// @route   GET /api/blockchain
router.route('/').get(getBlockchain);

// @route   GET /api/blockchain/donor/:donorId
router.route('/donor/:donorId').get(getBlockchainByDonorId);

// @route   POST /api/blockchain/verify
router.route('/verify').post(verifyBloodUnit);

module.exports = router;