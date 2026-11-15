# 🏠 PropNest — Real Estate Listing Platform

A full-stack MERN web app where **agents** list properties, **buyers** search, save and enquire, and **admins** oversee everything.

## ✨ Features

- 🔐 JWT authentication with roles: **Buyer**, **Agent**, **Admin**
- 🏘️ Property listings (flat, villa, plot, commercial) for **sale or rent**
- 🔎 Search & filters: city, type, bedrooms, price range, text search, sorting, pagination
- 🗺️ Map view and per-property location map (Leaflet + OpenStreetMap, no API key needed)
- ❤️ Favorites / wishlist
- 📩 Inquiry system: buyers message agents, agents track status (new / contacted / closed)
- 🧮 EMI / loan calculator on every sale listing
- 💰 Price-per-sq-ft shown on cards and details
- 🏠 "Similar properties" recommendations (same city + type, closest price)
- 📊 Agent dashboard: add, edit, delete listings and manage inquiries

## 🧰 Tech Stack

| Layer    | Tech                                  |
| -------- | ------------------------------------- |
| Frontend | React 18, Vite, React Router, Leaflet |
| Backend  | Node.js, Express                      |
| Database | MongoDB + Mongoose                    |
| Auth     | JWT + bcrypt                          |

## 📁 Project Structure

```
propnest/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # Navbar, PropertyCard, Filters, MapView, EmiCalculator
│       ├── pages/          # Home, PropertyDetails, Login, Register, Dashboard, ...
│       └── context/        # AuthContext
├── server/                 # Express backend
│   ├── models/             # User, Property, Inquiry
│   ├── routes/             # auth, properties, inquiries
│   ├── middleware/         # auth (JWT + roles)
│   └── seed.js             # demo data
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) 18+
- MongoDB running locally, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Install dependencies
```bash
npm run install:all
```

### 2. Configure environment variables
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```
Edit `server/.env` and set `MONGO_URI` and a long random `JWT_SECRET`.

### 3. (Optional) Load demo data
```bash
npm run seed
```
Demo logins created by the seed script:

| Role  | Email               | Password  |
| ----- | ------------------- | --------- |
| Admin | admin@propnest.com  | admin123  |
| Agent | agent@propnest.com  | agent123  |
| Buyer | buyer@propnest.com  | buyer123  |

> ⚠️ Demo credentials are for local development only. Don't seed a production database.

### 4. Run the app
Open two terminals:
```bash
npm run server   # API on http://localhost:5000
npm run client   # App on http://localhost:5173
```

## 🔌 API Overview

| Method | Endpoint                          | Access        | Description                  |
| ------ | --------------------------------- | ------------- | ---------------------------- |
| POST   | `/api/auth/register`              | Public        | Create account               |
| POST   | `/api/auth/login`                 | Public        | Login, returns JWT           |
| GET    | `/api/auth/me`                    | Logged in     | Current user                 |
| GET    | `/api/auth/favorites`             | Logged in     | Saved properties             |
| POST   | `/api/auth/favorites/:id`         | Logged in     | Toggle favorite              |
| GET    | `/api/properties`                 | Public        | List + filter + paginate     |
| GET    | `/api/properties/:id`             | Public        | Details + similar listings   |
| GET    | `/api/properties/mine`            | Agent/Admin   | Own listings                 |
| POST   | `/api/properties`                 | Agent/Admin   | Create listing               |
| PUT    | `/api/properties/:id`             | Owner/Admin   | Update listing               |
| DELETE | `/api/properties/:id`             | Owner/Admin   | Delete listing               |
| POST   | `/api/inquiries`                  | Logged in     | Contact agent                |
| GET    | `/api/inquiries/received`         | Agent/Admin   | Agent inbox                  |
| GET    | `/api/inquiries/sent`             | Logged in     | Buyer's sent inquiries       |
| PATCH  | `/api/inquiries/:id/status`       | Agent/Admin   | Update inquiry status        |

## 🛣️ Roadmap / Ideas to Extend

- [ ] Image upload with Cloudinary or AWS S3 (currently image URLs)
- [ ] Admin panel: manage users and approve listings
- [ ] AI price estimator (Python + scikit-learn)
- [ ] Email notifications for new inquiries
- [ ] Tests (Jest + Supertest) and GitHub Actions CI
- [ ] Deploy: Vercel (client) + Render (server) + MongoDB Atlas

## 🚢 Deployment

- **Database:** MongoDB Atlas (free tier)
- **Backend:** Render / Railway — set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
- **Frontend:** Vercel / Netlify — set `VITE_API_URL` to your deployed API URL

## 📄 License

MIT
