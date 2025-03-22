const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all blood records
router.get('/', async (req, res) => {
  try {
    const [bloodRecords] = await db.query('SELECT * FROM blood');
    res.json(bloodRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get blood by code
router.get('/:code', async (req, res) => {
  try {
    const [blood] = await db.query('SELECT * FROM blood WHERE code = ?', [req.params.code]);
    if (blood.length === 0) {
      return res.status(404).json({ message: 'Blood record not found' });
    }
    res.json(blood[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new blood record
router.post('/', async (req, res) => {
  const { blood_type, quantity } = req.body;
  
  try {
    const [result] = await db.query(
      'INSERT INTO blood (blood_type, quantity) VALUES (?, ?)',
      [blood_type, quantity]
    );
    res.status(201).json({ code: result.insertId, message: 'Blood record added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update blood record
router.put('/:code', async (req, res) => {
  const { blood_type, quantity } = req.body;
  
  try {
    await db.query(
      'UPDATE blood SET blood_type = ?, quantity = ? WHERE code = ?',
      [blood_type, quantity, req.params.code]
    );
    res.json({ message: 'Blood record updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete blood record
router.delete('/:code', async (req, res) => {
  try {
    await db.query('DELETE FROM blood WHERE code = ?', [req.params.code]);
    res.json({ message: 'Blood record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
