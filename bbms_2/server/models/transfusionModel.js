const mongoose = require('mongoose');

const transfusionSchema = mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Donor'
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Recipient'
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed", "Requesting Additional"],
    default: "Pending"
  },
  date: {
    type: Date,
    default: Date.now
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const Transfusion = mongoose.model('Transfusion', transfusionSchema);

module.exports = Transfusion; 