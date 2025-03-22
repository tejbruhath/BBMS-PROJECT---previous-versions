const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all donors
router.get('/', async (req, res) => {
  try {
    const [donors] = await db.query('SELECT * FROM donor');
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get donor by ID
router.get('/:id', async (req, res) => {
  try {
    const [donor] = await db.query('SELECT * FROM donor WHERE donor_id = ?', [req.params.id]);
    if (donor.length === 0) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.json(donor[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new donor
router.post('/', async (req, res) => {
  const { first_name, middle_name, last_name, dob, weight, gender, blood_group, rh_factor, city, mobile } = req.body;
  
  // Calculate age from DOB
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  try {
    const [result] = await db.query(
      'INSERT INTO donor (first_name, middle_name, last_name, dob, age, weight, gender, blood_group, rh_factor, city, mobile) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [first_name, middle_name, last_name, dob, age, weight, gender, blood_group, rh_factor, city, mobile]
    );
    res.status(201).json({ id: result.insertId, message: 'Donor added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update donor
router.put('/:id', async (req, res) => {
  const { first_name, middle_name, last_name, dob, weight, gender, blood_group, rh_factor, city, mobile } = req.body;
  
  // Calculate age from DOB
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  try {
    await db.query(
      'UPDATE donor SET first_name = ?, middle_name = ?, last_name = ?, dob = ?, age = ?, weight = ?, gender = ?, blood_group = ?, rh_factor = ?, city = ?, mobile = ? WHERE donor_id = ?',
      [first_name, middle_name, last_name, dob, age, weight, gender, blood_group, rh_factor, city, mobile, req.params.id]
    );
    res.json({ message: 'Donor updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete donor
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM donor WHERE donor_id = ?', [req.params.id]);
    res.json({ message: 'Donor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
