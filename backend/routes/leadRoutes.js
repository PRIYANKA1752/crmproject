const express = require("express");
const router = express.Router();

console.log("leadRoutes.js loaded");

const {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  getDashboardStats,
} = require("../controllers/leadController");

// Dashboard Statistics (keep this ABOVE "/:id" routes)
router.get("/dashboard/stats", getDashboardStats);

// Create Lead
router.post("/", createLead);

// Get All Leads
router.get("/", getLeads);

// Update Lead
router.put("/:id", updateLead);

// Delete Lead
router.delete("/:id", deleteLead);

module.exports = router;