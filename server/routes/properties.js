const express = require("express");
const Property = require("../models/Property");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/properties?city=&type=&listingType=&minPrice=&maxPrice=&bedrooms=&q=&sort=&page=&limit=
router.get("/", async (req, res, next) => {
  try {
    const { city, type, listingType, minPrice, maxPrice, bedrooms, q, sort } = req.query;
    const filter = { status: "available" };

    if (city) filter.city = new RegExp(`^${escapeRegex(city)}$`, "i");
    if (type) filter.type = type;
    if (listingType) filter.listingType = listingType;
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (q) filter.$text = { $search: q };

    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { createdAt: -1 },
    };
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 12, 50);

    const [items, total] = await Promise.all([
      Property.find(filter)
        .sort(sortMap[sort] || sortMap.newest)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("owner", "name phone"),
      Property.countDocuments(filter),
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// GET /api/properties/mine  (agent's own listings)
router.get("/mine", protect, authorize("agent", "admin"), async (req, res, next) => {
  try {
    const items = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET /api/properties/:id
router.get("/:id", async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "name email phone");
    if (!property) return res.status(404).json({ message: "Property not found" });

    // Simple "similar properties": same city + type, closest price
    const similar = await Property.find({
      _id: { $ne: property._id },
      city: property.city,
      type: property.type,
      status: "available",
    })
      .sort({ price: 1 })
      .limit(20);
    similar.sort((a, b) => Math.abs(a.price - property.price) - Math.abs(b.price - property.price));

    res.json({ property, similar: similar.slice(0, 4) });
  } catch (err) {
    next(err);
  }
});

// POST /api/properties
router.post("/", protect, authorize("agent", "admin"), async (req, res, next) => {
  try {
    const property = await Property.create({ ...req.body, owner: req.user._id });
    res.status(201).json(property);
  } catch (err) {
    next(err);
  }
});

// PUT /api/properties/:id
router.put("/:id", protect, authorize("agent", "admin"), async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    if (!isOwnerOrAdmin(property, req.user)) {
      return res.status(403).json({ message: "Not your listing" });
    }
    delete req.body.owner;
    Object.assign(property, req.body);
    await property.save();
    res.json(property);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/properties/:id
router.delete("/:id", protect, authorize("agent", "admin"), async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    if (!isOwnerOrAdmin(property, req.user)) {
      return res.status(403).json({ message: "Not your listing" });
    }
    await property.deleteOne();
    res.json({ message: "Property deleted" });
  } catch (err) {
    next(err);
  }
});

function isOwnerOrAdmin(property, user) {
  return user.role === "admin" || property.owner.toString() === user._id.toString();
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = router;
