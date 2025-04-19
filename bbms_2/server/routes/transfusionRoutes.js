const express = require('express');
const router = express.Router();
const { 
  getTransfusions, 
  getTransfusionById, 
  createTransfusion,
  updateTransfusionStatus
} = require('../controllers/transfusionController');

// @route   GET /api/transfusions
// @route   POST /api/transfusions
router.route('/').get(getTransfusions).post(createTransfusion);

// @route   GET /api/transfusions/:id
// @route   PUT /api/transfusions/:id
router.route('/:id')
  .get(getTransfusionById)
  .put(updateTransfusionStatus);

module.exports = router; 