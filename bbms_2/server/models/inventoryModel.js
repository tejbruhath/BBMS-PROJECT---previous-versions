const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Donor'
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true
  },
  rhFactor: {
    type: String,
    enum: ["Positive", "Negative"],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  donationDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Create a function to calculate expiry date (42 days from donation)
inventorySchema.pre('save', function(next) {
  if (!this.expiryDate) {
    const donationDate = this.donationDate || new Date();
    const expiryDate = new Date(donationDate);
    expiryDate.setDate(expiryDate.getDate() + 42); // Blood typically expires after 42 days
    this.expiryDate = expiryDate;
  }
  next();
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory; 