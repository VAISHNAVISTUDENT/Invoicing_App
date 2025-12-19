const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  tradeName: String,

  businessType: {
    type: String,
    required: true
  },

  address: {
    line1: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: "India" }
  },

  contact: {
    email: String,
    phone: String,
    website: String
  },

  invoiceConfig: {
    prefix: { type: String, default: "INV" },
    nextNumber: { type: Number, default: 1 }
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Company", companySchema);
