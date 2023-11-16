const mongoose = require('mongoose');

// MongoDB schema setup for Citizen
const citizenSchema = new mongoose.Schema({
  fullName: String,
  dateOfBirth: Date,
  fatherName: String,
  motherName: String,
  gender: String,
  bloodGroup: String,
});

const Citizen = mongoose.model('Citizen', citizenSchema);

// MongoDB schema setup for TitleTransfer
const titleTransferSchema = new mongoose.Schema({
  Name: String,
  Location: String,
  Size: Number,
  titleNumber: String,
  transferAgreement: {
    type: Boolean,
    default: false,
  },
  newOwnerName: String,
});

const TitleTransfer = mongoose.model('TitleTransfer', titleTransferSchema);

module.exports = {
  Citizen: Citizen,
  TitleTransfer: TitleTransfer,
};
