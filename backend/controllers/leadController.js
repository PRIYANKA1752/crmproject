const Lead = require("../models/Lead");

// -------------------------
// CREATE LEAD
// -------------------------
const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------
// GET ALL LEADS (WITH SEARCH + FILTER)
// -------------------------
const getLeads = async (req, res) => {
  try {
    const { search, stage } = req.query;

    let filter = {};

    // 🔍 SEARCH (name, email, company)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // 🎯 FILTER BY STAGE
    if (stage && stage !== "All") {
      filter.stage = stage;
    }

    const leads = await Lead.find(filter);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------
// UPDATE LEAD
// -------------------------
const updateLead = async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------
// DELETE LEAD
// -------------------------
const deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------
// DASHBOARD STATS (FIXED ERROR HERE)
// -------------------------
const getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();

    const newLeads = await Lead.countDocuments({ stage: "New" });
    const contacted = await Lead.countDocuments({ stage: "Contacted" });
    const qualified = await Lead.countDocuments({ stage: "Qualified" });
    const won = await Lead.countDocuments({ stage: "Won" });
    const lost = await Lead.countDocuments({ stage: "Lost" });

    res.json({
      totalLeads,
      newLeads,
      contacted,
      qualified,
      won,
      lost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------
// EXPORT ALL FUNCTIONS
// -------------------------
module.exports = {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  getDashboardStats,
};