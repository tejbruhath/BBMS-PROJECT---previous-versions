const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const donorRoutes = require('./routes/donorRoutes');
const recipientRoutes = require('./routes/recipientRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const transfusionRoutes = require('./routes/transfusionRoutes');
const blockchainRoutes = require('./routes/blockchainRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/donors', donorRoutes);
app.use('/api/recipients', recipientRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/transfusions', transfusionRoutes);
app.use('/api/blockchain', blockchainRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('BloodLink Supply Chain API is running...');
});

// Error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 