const express = require("express");
const Inquiry = require("../models/Inquiry");
const Property = require("../models/Property");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// POST /api/inquiries  (buyer sends a message about a property)
router.post("/", protect, async (req, res, next) => {
  try {
    const { propertyId, message, phone } = req.body;
    if (!propertyId || !message) {
      return res.status(400).json({ message: "propertyId and message are required" });
    }
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const inquiry = await Inquiry.create({
      property: property._id,
      buyer: req.user._id,
      agent: property.owner,
      message,
      phone,
    });
    res.status(201).json(inquiry);
  } catch (err) {
    next(err);
  }
});

// GET /api/inquiries/received  (agent inbox)
router.get("/received", protect, authorize("agent", "admin"), async (req, res, next) => {
  try {
    const items = await Inquiry.find({ agent: req.user._id })
      .sort({ createdAt: -1 })
      .populate("property", "title city price")
      .populate("buyer", "name email phone");
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET /api/inquiries/sent  (buyer's own inquiries)
router.get("/sent", protect, async (req, res, next) => {
  try {
    const items = await Inquiry.find({ buyer: req.user._id })
      .sort({ createdAt: -1 })
      .populate("property", "title city price");
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/inquiries/:id/status
router.patch("/:id/status", protect, authorize("agent", "admin"), async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    if (req.user.role !== "admin" && inquiry.agent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your inquiry" });
    }
    inquiry.status = req.body.status;
    await inquiry.save();
    res.json(inquiry);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
