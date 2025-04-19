const mongoose = require('mongoose');

const recipientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
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
  urgency: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    default: "Medium"
  },
  requestDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Recipient = mongoose.model('Recipient', recipientSchema);

module.exports = Recipient; 