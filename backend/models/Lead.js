const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  company: {
    type: String,
  },
  stage: {
    type: String,
    enum: ["New", "Contacted", "Qualified", "Won", "Lost"],
    default: "New",
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Lead", leadSchema);