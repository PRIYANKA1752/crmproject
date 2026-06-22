const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER (optional but useful)
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;

  // demo check (replace with DB check if needed)
  if (email === "test@gmail.com" && password === "123456") {
    const token = jwt.sign(
      { email },
      "secretkey123",
      { expiresIn: "1d" }
    );

    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
};

module.exports = { login };