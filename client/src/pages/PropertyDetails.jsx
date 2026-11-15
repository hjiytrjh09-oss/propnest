import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, formatPrice } from "../api";
import { useAuth } from "../context/AuthContext";
import PropertyCard from "../components/PropertyCard";
import EmiCalculator from "../components/EmiCalculator";
import MapView from "../components/MapView";

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    setData(null);
    setSent(false);
    setImgIdx(0);
    api(`/properties/${id}`, { auth: false })
      .then(setData)
      .catch((e) => setError(e.message));
  }, [id]);

  const sendInquiry = async (e) => {
    e.preventDefault();
    try {
      await api("/inquiries", { method: "POST", body: { propertyId: id, message, phone } });
      setSent(true);
      setMessage("");
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;

  const { property: p, similar } = data;
  const images = p.images?.length ? p.images : [];

  return (
    <>
      <Link to="/">← Back to listings</Link>

      <div className="details">
        <div>
          {images.length > 0 ? (
            <>
              <img src={images[imgIdx]} alt={p.title} className="hero-img" />
              <div className="thumbs">
                {images.map((src, i) => (
                  <img key={i} src={src} alt="" onClick={() => setImgIdx(i)} className={i === imgIdx ? "active" : ""} />
                ))}
              </div>
            </>
          ) : (
            <div className="hero-img placeholder">No photos uploaded</div>
          )}

          <h1>{p.title}</h1>
          <p className="muted">
            {p.address ? `${p.address}, ` : ""}
            {p.city}
          </p>
          <p className="meta big">
            {p.bedrooms > 0 && <span>{p.bedrooms} Bed</span>}
            {p.bathrooms > 0 && <span>{p.bathrooms} Bath</span>}
            <span>{p.area} sq ft</span>
            <span>₹{Math.round(p.price / p.area).toLocaleString("en-IN")}/sq ft</span>
            <span className="tag">{p.type}</span>
            <span className="tag">{p.listingType === "rent" ? "For rent" : "For sale"}</span>
          </p>

          <h3>Description</h3>
          <p>{p.description || "No description provided."}</p>

          {p.amenities?.length > 0 && (
            <>
              <h3>Amenities</h3>
              <div className="chips">
                {p.amenities.map((a) => (
                  <span key={a} className="chip">
                    {a}
                  </span>
                ))}
              </div>
            </>
          )}

          {p.lat && p.lng && (
            <>
              <h3>Location</h3>
              <MapView properties={[p]} height={300} zoom={14} />
            </>
          )}
        </div>

        <aside>
          <div className="panel">
            <div className="price big">
              {formatPrice(p.price)}
              {p.listingType === "rent" && <small>/mo</small>}
            </div>
            <p className="muted">
              Listed by {p.owner?.name}
              {p.owner?.phone ? ` · ${p.owner.phone}` : ""}
            </p>

            {sent ? (
              <p className="success">Inquiry sent! The agent will contact you soon.</p>
            ) : user ? (
              <form onSubmit={sendInquiry} className="form">
                <textarea
                  required
                  rows="4"
                  placeholder="I'm interested in this property..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <input placeholder="Your phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <button className="btn">Contact agent</button>
              </form>
            ) : (
              <p>
                <Link to="/login">Log in</Link> to contact the agent.
              </p>
            )}
          </div>

          {p.listingType === "sale" && <EmiCalculator price={p.price} />}
        </aside>
      </div>

      {similar.length > 0 && (
        <>
          <h2>Similar properties</h2>
          <div className="grid">
            {similar.map((s) => (
              <PropertyCard key={s._id} property={s} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
