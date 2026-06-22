const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    company: String,
    sourceLeadId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);