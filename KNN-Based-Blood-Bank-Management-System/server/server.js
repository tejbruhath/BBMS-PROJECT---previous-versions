const express = require('express');
const cors = require('cors');
const donorRoutes = require('./routes/donorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const bloodRoutes = require('./routes/bloodRoutes');
const bloodBankRoutes = require('./routes/bloodBankRoutes');
const knnRoutes = require('./routes/knnRoutes');

const app = express();
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/donors', donorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/blood', bloodRoutes);
app.use('/api/blood-bank', bloodBankRoutes);
app.use('/api/knn', knnRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
