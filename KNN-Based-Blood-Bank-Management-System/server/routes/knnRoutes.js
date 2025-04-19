const express = require('express');
const router = express.Router();
const db = require('../db');

// Function to calculate Euclidean distance
const calculateDistance = (point1, point2) => {
  // For simplicity, we're using city as a proxy for location
  // In a real application, you'd use latitude and longitude
  const cityDistance = point1.city === point2.city ? 0 : 5; // Simple distance metric
  
  // Blood type compatibility (simplified)
  let bloodTypeCompatibility = 10; // Default high distance (incompatible)
  
  // Check blood type compatibility
  if (point1.blood_group === point2.blood_group && point1.rh_factor === point2.rh_factor) {
    bloodTypeCompatibility = 0; // Perfect match
  } else if (point2.blood_group === 'O' && point2.rh_factor === 'Negative') {
    bloodTypeCompatibility = 1; // Universal donor
  }
  
  // Weight the factors
  return Math.sqrt(Math.pow(cityDistance, 2) + Math.pow(bloodTypeCompatibility, 2));
};

// Find nearest donors using KNN
router.post('/find-donors', async (req, res) => {
  try {
    const { blood_group, rh_factor, city, k = 5 } = req.body;
    
    if (!blood_group || !rh_factor || !city) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    
    // Get all donors
    const [donors] = await db.query('SELECT * FROM donor');
    
    // Patient data point
    const patient = { blood_group, rh_factor, city };
    
    // Calculate distances
    const donorsWithDistance = donors.map(donor => ({
      ...donor,
      distance: calculateDistance(patient, donor)
    }));
    
    // Sort by distance and get k nearest donors
    const nearestDonors = donorsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, k);
    
    res.json(nearestDonors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
