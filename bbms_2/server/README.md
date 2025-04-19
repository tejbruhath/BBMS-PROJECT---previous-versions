# BloodLink Supply Chain Backend

This is the MongoDB backend for the BloodLink Supply Chain Nexus application.

## Prerequisites

- Node.js (>= 14.x)
- MongoDB installed locally or a MongoDB Atlas account
- npm or yarn

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root of the server directory with the following content:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/bloodlink-db
   ```

3. If you're using MongoDB Atlas, replace the MONGO_URI with your connection string.

## Running the Server

1. Start the server:
   ```
   npm run dev
   ```

2. The server will be available at `http://localhost:5000`

## Initialize Database with Sample Data

1. Run the database initialization script:
   ```
   node scripts/initDb.js
   ```

## API Endpoints

### Donors
- `GET /api/donors` - Get all donors
- `GET /api/donors/:id` - Get donor by ID
- `POST /api/donors` - Create a new donor

### Recipients
- `GET /api/recipients` - Get all recipients
- `GET /api/recipients/:id` - Get recipient by ID
- `GET /api/recipients/:id/matches` - Find matching donors for a recipient
- `POST /api/recipients` - Create a new recipient

### Inventory
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/stats` - Get inventory statistics
- `GET /api/inventory/expiring` - Get soon-to-expire inventory items

### Transfusions
- `GET /api/transfusions` - Get all transfusions
- `GET /api/transfusions/:id` - Get transfusion by ID
- `POST /api/transfusions` - Create a new transfusion
- `PUT /api/transfusions/:id` - Update transfusion status

### Blockchain
- `GET /api/blockchain` - Get all blockchain records
- `GET /api/blockchain/donor/:donorId` - Get blockchain records by donor ID
- `POST /api/blockchain/verify` - Verify a blood unit in the blockchain

## Integration with Frontend

The frontend should be configured to connect to the backend API at `http://localhost:5000`. 
Make API calls from the frontend to fetch and manage data instead of using the mock data services. 