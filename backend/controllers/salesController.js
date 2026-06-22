const Sales = require("../models/Sales");

// Create Sale
const createSale = async (req, res) => {
  try {
    const sale = new Sales(req.body);
    await sale.save();
    res.json(sale);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get all sales
const getSales = async (req, res) => {
  try {
    const sales = await Sales.find();
    res.json(sales);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get total revenue
const getRevenue = async (req, res) => {
  try {
    const sales = await Sales.find();
    const total = sales.reduce((sum, s) => sum + s.amount, 0);
    res.json({ totalRevenue: total });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createSale,
  getSales,
  getRevenue,
};