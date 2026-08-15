const Lead = require("../models/Lead");

// -------------------------
// CREATE LEAD
// -------------------------
const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, stage } = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      stage: stage || "New",
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error("Create Lead Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "A lead with this email already exists",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

// -------------------------
// GET ALL LEADS
// SEARCH + FILTER
// -------------------------
const getLeads = async (req, res) => {
  try {
    const { search, stage } = req.query;

    let filter = {};

    // Stage filter
    if (stage && stage !== "All") {
      filter.stage = stage;
    }

    // Search filter
    if (search) {
      const regex = new RegExp(search, "i");

      filter.$or = [
        { name: regex },
        { email: regex },
        { company: regex },
        { phone: regex },
      ];
    }

    const leads = await Lead.find(filter).sort({
      createdAt: -1,
    });

    res.json(leads);
  } catch (error) {
    console.error("Get Leads Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// -------------------------
// UPDATE LEAD
// -------------------------
const updateLead = async (req, res) => {
  try {
    const id = req.params.id;

    // Don't allow frontend to modify these fields
    const {
      _id,
      id: removeId,
      createdAt,
      updatedAt,
      ...updateData
    } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.json(lead);
  } catch (error) {
    console.error("Update Lead Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// -------------------------
// DELETE LEAD
// -------------------------
const deleteLead = async (req, res) => {
  try {
    const id = req.params.id;

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.json({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete Lead Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// -------------------------
// DASHBOARD STATS
// -------------------------
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalLeads,
      newLeads,
      contacted,
      qualified,
      won,
      lost,
    ] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ stage: "New" }),
      Lead.countDocuments({ stage: "Contacted" }),
      Lead.countDocuments({ stage: "Qualified" }),
      Lead.countDocuments({ stage: "Won" }),
      Lead.countDocuments({ stage: "Lost" }),
    ]);

    res.json({
      totalLeads,
      newLeads,
      contacted,
      qualified,
      won,
      lost,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  getDashboardStats,
};