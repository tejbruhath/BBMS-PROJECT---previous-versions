const mongoose = require('mongoose');

const blockchainSchema = mongoose.Schema({
  blockId: {
    type: String,
    unique: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Donor'
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipient'
  },
  transactionType: {
    type: String,
    enum: ["Donation", "Transfusion", "Expiry", "Verification"],
    required: true
  },
  status: {
    type: String,
    enum: ["Valid", "Invalid", "Pending"],
    default: "Valid"
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true
  },
  location: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Generate a unique blockId before saving
blockchainSchema.pre('save', function(next) {
  if (!this.blockId) {
    // Create a blockchain hash-like ID using random string
    this.blockId = new mongoose.Types.ObjectId().toString() + 
                  Math.random().toString(36).substring(2, 15);
  }
  next();
});

const Blockchain = mongoose.model('Blockchain', blockchainSchema);

module.exports = Blockchain; 