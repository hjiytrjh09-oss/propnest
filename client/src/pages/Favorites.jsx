import { useEffect, useState } from "react";
import { api } from "../api";
import PropertyCard from "../components/PropertyCard";

export default function Favorites() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    api("/auth/favorites").then(setItems).catch(() => setItems([]));
  }, []);

  const toggle = async (id) => {
    await api(`/auth/favorites/${id}`, { method: "POST" });
    setItems((prev) => prev.filter((p) => p._id !== id));
  };

  if (!items) return <p>Loading...</p>;

  return (
    <>
      <h2>My saved properties</h2>
      {items.length === 0 && <p className="muted">Nothing saved yet. Tap the heart on any listing.</p>}
      <div className="grid">
        {items.map((p) => (
          <PropertyCard key={p._id} property={p} isFavorite onToggleFavorite={toggle} />
        ))}
      </div>
    </>
  );
}
