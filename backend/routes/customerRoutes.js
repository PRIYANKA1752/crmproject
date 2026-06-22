const express = require("express");
const router = express.Router();

const {
  convertToCustomer,
  getCustomers,
  deleteCustomer,
} = require("../controllers/customerController");

router.post("/convert/:id", convertToCustomer);
router.get("/", getCustomers);
router.delete("/:id", deleteCustomer);

module.exports = router;