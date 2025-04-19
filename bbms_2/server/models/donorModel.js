const mongoose = require('mongoose');

const donorSchema = mongoose.Schema({
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
  isSmoker: {
    type: Boolean,
    default: false
  },
  isAlcoholConsumer: {
    type: Boolean,
    default: false
  },
  smokingConsent: {
    type: Boolean,
    default: false
  },
  alcoholConsent: {
    type: Boolean,
    default: false
  },
  donationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor; 