const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all blood bank records
router.get('/', async (req, res) => {
  try {
    const [bloodBankRecords] = await db.query('SELECT * FROM blood_bank');
    res.json(bloodBankRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get blood bank record by order number
router.get('/:orders', async (req, res) => {
  try {
    const [bloodBank] = await db.query('SELECT * FROM blood_bank WHERE orders = ?', [req.params.orders]);
    if (bloodBank.length === 0) {
      return res.status(404).json({ message: 'Blood bank record not found' });
    }
    res.json(bloodBank[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new blood bank record
router.post('/', async (req, res) => {
  const { blood_type, quantity } = req.body;
  
  try {
    const [result] = await db.query(
      'INSERT INTO blood_bank (blood_type, quantity) VALUES (?, ?)',
      [blood_type, quantity]
    );
    res.status(201).json({ orders: result.insertId, message: 'Blood bank record added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update blood bank record
router.put('/:orders', async (req, res) => {
  const { blood_type, quantity } = req.body;
  
  try {
    await db.query(
      'UPDATE blood_bank SET blood_type = ?, quantity = ? WHERE orders = ?',
      [blood_type, quantity, req.params.orders]
    );
    res.json({ message: 'Blood bank record updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete blood bank record
router.delete('/:orders', async (req, res) => {
  try {
    await db.query('DELETE FROM blood_bank WHERE orders = ?', [req.params.orders]);
    res.json({ message: 'Blood bank record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
