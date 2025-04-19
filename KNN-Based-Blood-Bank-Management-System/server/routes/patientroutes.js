const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all patients
router.get('/', async (req, res) => {
  try {
    const [patients] = await db.query('SELECT * FROM patient');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get patient by ID
router.get('/:id', async (req, res) => {
  try {
    const [patient] = await db.query('SELECT * FROM patient WHERE id = ?', [req.params.id]);
    if (patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new patient
router.post('/', async (req, res) => {
  const { name, gender, dob, blood_group, quantity, hospital_name, place } = req.body;
  
  try {
    const [result] = await db.query(
      'INSERT INTO patient (name, gender, dob, blood_group, quantity, hospital_name, place) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, gender, dob, blood_group, quantity, hospital_name, place]
    );
    res.status(201).json({ id: result.insertId, message: 'Patient added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update patient
router.put('/:id', async (req, res) => {
  const { name, gender, dob, blood_group, quantity, hospital_name, place } = req.body;
  
  try {
    await db.query(
      'UPDATE patient SET name = ?, gender = ?, dob = ?, blood_group = ?, quantity = ?, hospital_name = ?, place = ? WHERE id = ?',
      [name, gender, dob, blood_group, quantity, hospital_name, place, req.params.id]
    );
    res.json({ message: 'Patient updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete patient
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM patient WHERE id = ?', [req.params.id]);
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
