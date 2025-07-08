const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const pool = new Pool();

// === Register ===
const register = async (req, res) => {
  const { name, email, password } = req.body;
  const role = "participant"; // Force role for security

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, role]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ user: { id: user.id, name: user.name, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "User already exists or invalid input" });
  }
};

// === Login ===
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ user: { id: user.id, name: user.name, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login error" });
  }
};

// === Forgot Password ===
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Email not registered" });

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"ACM Recruitment" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `<p>Click below to reset your password. This link is valid for 15 minutes:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ message: "Reset link sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// === Reset Password ===
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(password, 10);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashed, decoded.id]);
    res.json({ message: "Password reset successful." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid or expired token." });
  }
};

// ✅ Export all
module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword
};
