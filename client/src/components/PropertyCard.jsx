import { Link } from "react-router-dom";
import { formatPrice } from "../api";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240'><rect width='100%' height='100%' fill='#e8edf3'/><text x='50%' y='50%' fill='#9aa7b8' font-family='sans-serif' font-size='18' text-anchor='middle'>No photo</text></svg>`
  );

export default function PropertyCard({ property: p, isFavorite, onToggleFavorite }) {
  return (
    <div className="card">
      <Link to={`/property/${p._id}`}>
        <img src={p.images?.[0] || PLACEHOLDER} alt={p.title} className="card-img" />
      </Link>
      <div className="card-body">
        <div className="row">
          <strong className="price">
            {formatPrice(p.price)}
            {p.listingType === "rent" && <small>/mo</small>}
          </strong>
          {onToggleFavorite && (
            <button
              className="heart"
              title="Save"
              onClick={() => onToggleFavorite(p._id)}
              aria-label="Toggle favorite"
            >
              {isFavorite ? "♥" : "♡"}
            </button>
          )}
        </div>
        <Link to={`/property/${p._id}`} className="card-title">
          {p.title}
        </Link>
        <p className="muted">
          {p.city} · {p.type}
        </p>
        <p className="meta">
          {p.bedrooms > 0 && <span>{p.bedrooms} BHK</span>}
          <span>{p.area} sq ft</span>
          <span>₹{Math.round(p.price / p.area).toLocaleString("en-IN")}/sq ft</span>
        </p>
      </div>
    </div>
  );
}
