import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

const EMPTY = {
  title: "",
  description: "",
  price: "",
  listingType: "sale",
  type: "flat",
  bedrooms: 2,
  bathrooms: 2,
  area: "",
  city: "",
  address: "",
  lat: "",
  lng: "",
  amenities: "",
  images: "",
  status: "available",
};

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    if (!id) return;
    api(`/properties/${id}`, { auth: false }).then(({ property: p }) =>
      setForm({
        ...EMPTY,
        ...p,
        lat: p.lat ?? "",
        lng: p.lng ?? "",
        amenities: (p.amenities || []).join(", "),
        images: (p.images || []).join("\n"),
      })
    );
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const body = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      listingType: form.listingType,
      type: form.type,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      city: form.city,
      address: form.address,
      lat: form.lat === "" ? undefined : Number(form.lat),
      lng: form.lng === "" ? undefined : Number(form.lng),
      amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      status: form.status,
    };
    try {
      await api(id ? `/properties/${id}` : "/properties", { method: id ? "PUT" : "POST", body });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-box wide">
      <h2>{id ? "Edit property" : "Add new property"}</h2>
      <form onSubmit={submit} className="form">
        <input placeholder="Title" required value={form.title} onChange={set("title")} />
        <textarea rows="4" placeholder="Description" value={form.description} onChange={set("description")} />

        <div className="two-col">
          <select value={form.listingType} onChange={set("listingType")}>
            <option value="sale">For sale</option>
            <option value="rent">For rent</option>
          </select>
          <select value={form.type} onChange={set("type")}>
            <option value="flat">Flat</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div className="two-col">
          <input type="number" placeholder="Price (₹)" required value={form.price} onChange={set("price")} />
          <input type="number" placeholder="Area (sq ft)" required value={form.area} onChange={set("area")} />
        </div>

        <div className="two-col">
          <input type="number" min="0" placeholder="Bedrooms" value={form.bedrooms} onChange={set("bedrooms")} />
          <input type="number" min="0" placeholder="Bathrooms" value={form.bathrooms} onChange={set("bathrooms")} />
        </div>

        <div className="two-col">
          <input placeholder="City" required value={form.city} onChange={set("city")} />
          <input placeholder="Address / locality" value={form.address} onChange={set("address")} />
        </div>

        <div className="two-col">
          <input type="number" step="any" placeholder="Latitude (for map)" value={form.lat} onChange={set("lat")} />
          <input type="number" step="any" placeholder="Longitude (for map)" value={form.lng} onChange={set("lng")} />
        </div>

        <input
          placeholder="Amenities (comma separated: Parking, Gym, Lift)"
          value={form.amenities}
          onChange={set("amenities")}
        />
        <textarea
          rows="3"
          placeholder="Image URLs (one per line)"
          value={form.images}
          onChange={set("images")}
        />

        {id && (
          <select value={form.status} onChange={set("status")}>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
        )}

        {error && <p className="error">{error}</p>}
        <button className="btn">{id ? "Save changes" : "Create listing"}</button>
      </form>
    </div>
  );
}
