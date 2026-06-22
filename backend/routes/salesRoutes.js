const express = require("express");
const router = express.Router();

const {
  createSale,
  getSales,
  getRevenue,
} = require("../controllers/salesController");

router.post("/", createSale);
router.get("/", getSales);
router.get("/revenue", getRevenue);

module.exports = router;