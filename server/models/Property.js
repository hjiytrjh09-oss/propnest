const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    listingType: { type: String, enum: ["sale", "rent"], default: "sale" },
    type: {
      type: String,
      enum: ["flat", "villa", "plot", "commercial"],
      required: true,
    },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: Number, required: true }, // sq ft
    city: { type: String, required: true, trim: true },
    address: { type: String, default: "" },
    lat: Number,
    lng: Number,
    amenities: [String],
    images: [String], // image URLs
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["available", "sold", "rented"], default: "available" },
  },
  { timestamps: true }
);

propertySchema.index({ title: "text", city: "text", address: "text" });

module.exports = mongoose.model("Property", propertySchema);
