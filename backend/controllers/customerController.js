const Customer = require("../models/Customer");
const Lead = require("../models/Lead");

// Convert Lead → Customer
const convertToCustomer = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const customer = new Customer({
      name: lead.name,
      email: lead.email,
      company: lead.company,
      sourceLeadId: lead._id,
    });

    await customer.save();

    res.json({ message: "Converted to customer", customer });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get all customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  convertToCustomer,
  getCustomers,
  deleteCustomer,
};