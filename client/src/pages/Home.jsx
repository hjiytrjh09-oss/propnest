import { useEffect, useState, useCallback } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import Filters from "../components/Filters";
import PropertyCard from "../components/PropertyCard";
import MapView from "../components/MapView";

const EMPTY = {
  q: "",
  city: "",
  type: "",
  listingType: "",
  bedrooms: "",
  minPrice: "",
  maxPrice: "",
  sort: "newest",
};

export default function Home() {
  const { user } = useAuth();
  const [filters, setFilters] = useState(EMPTY);
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [favIds, setFavIds] = useState([]);
  const [view, setView] = useState("grid");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ page, limit: 12 });
        Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
        setData(await api(`/properties?${params}`, { auth: false }));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) return setFavIds([]);
    api("/auth/favorites")
      .then((list) => setFavIds(list.map((p) => p._id)))
      .catch(() => {});
  }, [user]);

  const toggleFavorite = async (id) => {
    if (!user) return alert("Please log in to save properties.");
    const res = await api(`/auth/favorites/${id}`, { method: "POST" });
    setFavIds(res.favorites);
  };

  return (
    <>
      <section className="hero">
        <h1>Find your dream property</h1>
        <p className="muted">Flats, villas, plots and commercial spaces — all in one place.</p>
      </section>

      <Filters filters={filters} setFilters={setFilters} onSearch={() => load(1)} />

      <div className="row toolbar">
        <span className="muted">{data.total} properties found</span>
        <div className="toggle">
          <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}>
            Grid
          </button>
          <button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>
            Map
          </button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && view === "map" && <MapView properties={data.items} />}

      {!loading && view === "grid" && (
        <div className="grid">
          {data.items.map((p) => (
            <PropertyCard
              key={p._id}
              property={p}
              isFavorite={favIds.includes(p._id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
          {data.items.length === 0 && <p>No properties match your search.</p>}
        </div>
      )}

      {data.pages > 1 && (
        <div className="pager">
          <button className="btn btn-outline" disabled={data.page <= 1} onClick={() => load(data.page - 1)}>
            Previous
          </button>
          <span>
            Page {data.page} of {data.pages}
          </span>
          <button className="btn btn-outline" disabled={data.page >= data.pages} onClick={() => load(data.page + 1)}>
            Next
          </button>
        </div>
      )}
    </>
  );
}
