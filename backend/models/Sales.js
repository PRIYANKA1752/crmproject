const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema(
  {
    customerName: String,
    customerEmail: String,
    amount: Number,
    status: {
      type: String,
      default: "Closed",
    },
    leadId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sales", salesSchema);