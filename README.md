# BloodLink Supply Chain Nexus

BloodLink Supply Chain Nexus is a blood donation management system that tracks blood donations from donation to transfusion using a blockchain-inspired verification system.

## Features

- Donor management
- Recipient registration
- Blood inventory tracking
- Transfusion event management
- Blockchain verification for supply chain integrity
- MongoDB database backend

## Project Structure

- **Frontend**: React application using TypeScript, Tailwind CSS, and Shadcn UI
- **Backend**: Express.js server with MongoDB database

## Installation & Setup

### Prerequisites

- Node.js (>=14.x)
- MongoDB installed locally or MongoDB Atlas account

### Frontend

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/bloodlink-supply-chain-nexus.git
   cd bloodlink-supply-chain-nexus
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

### Backend

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install backend dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Make sure the `.env` file in the server directory contains:
     ```
     NODE_ENV=development
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/bloodlink-db
     ```

4. Initialize the database with sample data:
   ```
   node scripts/initDb.js
   ```

5. Start the backend server:
   ```
   npm run dev
   ```

6. The API will be available at `http://localhost:5000`

## Running the Application

1. Start both the frontend and backend servers.
2. Access the application at `http://localhost:5173` (or the port shown in your terminal).

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

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/fe3cf4b5-2cac-476f-b4b6-580a9db965f5

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/fe3cf4b5-2cac-476f-b4b6-580a9db965f5) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/fe3cf4b5-2cac-476f-b4b6-580a9db965f5) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

I'll identify and track all user-provided variables and generated values in the system.

Search files...

Search files...

Read file: src/types/blood.ts
Based on my analysis of the codebase, here's a comprehensive breakdown of all user-provided variables and system-generated IDs:

## User-Provided Variables (Form Inputs)

### From Donors:
1. **name**: Patient's full name
2. **age**: Donor's age
3. **location**: Hospital or blood bank location
4. **bloodGroup**: Blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)
5. **rhFactor**: Positive or Negative
6. **isSmoker**: Boolean indicating if donor smokes
7. **isAlcoholConsumer**: Boolean indicating if donor consumes alcohol
8. **smokingConsent**: Confirmation that donor hasn't smoked in last 4 hours
9. **alcoholConsent**: Confirmation that donor hasn't consumed alcohol in last 3 days

### From Recipients:
1. **name**: Recipient's full name
2. **age**: Recipient's age
3. **location**: Hospital/clinic where transfusion will occur
4. **bloodGroup**: Blood type needed (A+, A-, B+, B-, AB+, AB-, O+, O-)
5. **rhFactor**: Positive or Negative
6. **urgency**: Level of urgency (Low, Medium, High, Critical)

## System-Generated IDs

1. **donor.id**: Unique identifier for each donor (generated with `generateId()`)
2. **recipient.id**: Unique identifier for each recipient (generated with `generateId()`)
3. **transfusion.id**: Unique identifier for each transfusion event (generated with `generateId()`)
4. **blockchainRecord.blockId**: Unique identifier for each blockchain record (generated with `generateId()`)

## System-Generated Timestamps and Dates

1. **donationDate**: Date when blood was donated (current date when donor is added)
2. **expiryDate**: Date when blood expires (42 days after donation date)
3. **requestDate**: Date when transfusion was requested (current date when recipient is added)
4. **transfusion.date**: Date when transfusion was initiated
5. **blockchainRecord.timestamp**: Timestamp of blockchain record creation

## Transaction Flow and Data Tracking

1. When a donor submits information:
   - A unique `donor.id` is generated
   - Donor data is stored in `donors` state
   - A new inventory item is created with `donorId`
   - A blockchain record of type "Donation" is created with a new `blockId`

2. When a recipient submits information:
   - A unique `recipient.id` is generated
   - Recipient data is stored in `recipients` state
   - The system finds matching donors using the blood compatibility algorithm

3. When a transfusion is initiated:
   - A unique `transfusion.id` is generated
   - Transfusion event is recorded with `donorId` and `recipientId`
   - A blockchain record of type "Transfusion" with status "Pending" is created

4. When a transfusion status is updated:
   - The transfusion record is updated
   - If status becomes "Completed":
     - Blood unit is removed from inventory
     - A new blockchain record is created with status "Valid"

5. When blood unit verification is performed:
   - The system checks for donation and transfusion records
   - Verifies if the unit should be in inventory
   - Creates a blockchain record of type "Verification"

The system maintains data integrity by tracking each blood unit from donation through transfusion using these unique IDs across all entities (donors, recipients, inventory, transfusions, and blockchain).
