// Run with: npm run seed
// Creates demo users + sample properties so the app isn't empty.
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Property = require("./models/Property");

const sample = [
  { title: "3 BHK Apartment near Lake View", city: "Guntur", type: "flat", bedrooms: 3, bathrooms: 2, area: 1450, price: 6800000, lat: 16.3067, lng: 80.4365, amenities: ["Parking", "Lift", "Gym", "24x7 Security"] },
  { title: "Spacious Villa with Garden", city: "Vijayawada", type: "villa", bedrooms: 4, bathrooms: 4, area: 3200, price: 18500000, lat: 16.5062, lng: 80.648, amenities: ["Garden", "Parking", "Power Backup"] },
  { title: "East-facing Residential Plot", city: "Guntur", type: "plot", bedrooms: 0, bathrooms: 0, area: 2400, price: 4200000, lat: 16.33, lng: 80.45, amenities: ["Gated Layout", "Wide Roads"] },
  { title: "Commercial Shop on Main Road", city: "Hyderabad", type: "commercial", bedrooms: 0, bathrooms: 1, area: 650, price: 9500000, lat: 17.385, lng: 78.4867, amenities: ["Main Road", "Parking"] },
  { title: "2 BHK Flat for Rent", city: "Hyderabad", type: "flat", listingType: "rent", bedrooms: 2, bathrooms: 2, area: 1100, price: 22000, lat: 17.44, lng: 78.35, amenities: ["Lift", "Parking"] },
  { title: "Modern 3 BHK Gated Community Flat", city: "Vijayawada", type: "flat", bedrooms: 3, bathrooms: 3, area: 1650, price: 7900000, lat: 16.52, lng: 80.62, amenities: ["Pool", "Gym", "Clubhouse", "Parking"] },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany({}), Property.deleteMany({})]);

  const [admin, agent] = await User.create([
    { name: "Admin", email: "admin@propnest.com", password: "admin123", role: "admin" },
    { name: "Demo Agent", email: "agent@propnest.com", password: "agent123", role: "agent", phone: "9999999999" },
  ]);
  await User.create({ name: "Demo Buyer", email: "buyer@propnest.com", password: "buyer123", role: "buyer" });

  await Property.insertMany(
    sample.map((p) => ({
      ...p,
      description: "Well-maintained property in a prime location with great connectivity.",
      images: [],
      owner: agent._id,
    }))
  );

  console.log("Seeded. Demo logins:");
  console.log("  admin@propnest.com / admin123");
  console.log("  agent@propnest.com / agent123");
  console.log("  buyer@propnest.com / buyer123");
  await mongoose.disconnect();
})();
