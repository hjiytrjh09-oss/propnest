const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const userPayload = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
});

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered" });
    }
    // Admin accounts can never be created through public signup
    const safeRole = role === "agent" ? "agent" : "buyer";
    const user = await User.create({ name, email, password, phone, role: safeRole });
    res.status(201).json({ token: signToken(user._id), user: userPayload(user) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ token: signToken(user._id), user: userPayload(user) });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get("/me", protect, (req, res) => {
  res.json({ user: userPayload(req.user) });
});

// GET /api/auth/favorites
router.get("/favorites", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/favorites/:propertyId  (toggle)
router.post("/favorites/:propertyId", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const id = req.params.propertyId;
    const exists = user.favorites.some((f) => f.toString() === id);
    user.favorites = exists
      ? user.favorites.filter((f) => f.toString() !== id)
      : [...user.favorites, id];
    await user.save();
    res.json({ favorited: !exists, favorites: user.favorites });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
