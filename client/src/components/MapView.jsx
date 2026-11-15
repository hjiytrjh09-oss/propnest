import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { formatPrice } from "../api";

// Fix Leaflet's default marker icons under bundlers (use CDN images)
const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function MapView({ properties, height = 420, zoom = 7 }) {
  const withCoords = properties.filter((p) => p.lat && p.lng);
  if (withCoords.length === 0) return <p className="muted">No map locations available.</p>;

  const center = [withCoords[0].lat, withCoords[0].lng];

  return (
    <div style={{ height }} className="map-wrap">
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {withCoords.map((p) => (
          <Marker key={p._id} position={[p.lat, p.lng]} icon={icon}>
            <Popup>
              <strong>{p.title}</strong>
              <br />
              {formatPrice(p.price)}
              <br />
              <Link to={`/property/${p._id}`}>View details</Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
