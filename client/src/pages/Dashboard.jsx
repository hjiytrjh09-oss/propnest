import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatPrice } from "../api";

export default function Dashboard() {
  const [listings, setListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    api("/properties/mine").then(setListings).catch((e) => setError(e.message));
    api("/inquiries/received").then(setInquiries).catch((e) => setError(e.message));
  };
  useEffect(load, []);

  const remove = async (id) => {
    if (!confirm("Delete this listing?")) return;
    await api(`/properties/${id}`, { method: "DELETE" });
    load();
  };

  const setStatus = async (id, status) => {
    await api(`/inquiries/${id}/status`, { method: "PATCH", body: { status } });
    load();
  };

  return (
    <>
      <div className="row">
        <h2>Agent dashboard</h2>
        <Link to="/dashboard/new" className="btn">
          + Add property
        </Link>
      </div>
      {error && <p className="error">{error}</p>}

      <h3>My listings ({listings.length})</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>City</th>
            <th>Price</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {listings.map((p) => (
            <tr key={p._id}>
              <td>
                <Link to={`/property/${p._id}`}>{p.title}</Link>
              </td>
              <td>{p.city}</td>
              <td>{formatPrice(p.price)}</td>
              <td>{p.status}</td>
              <td className="actions">
                <Link to={`/dashboard/edit/${p._id}`}>Edit</Link>
                <button className="link-danger" onClick={() => remove(p._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {listings.length === 0 && (
            <tr>
              <td colSpan="5" className="muted">
                No listings yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Inquiries ({inquiries.length})</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Property</th>
            <th>From</th>
            <th>Message</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((q) => (
            <tr key={q._id}>
              <td>{q.property?.title}</td>
              <td>
                {q.buyer?.name}
                <br />
                <small className="muted">{q.phone || q.buyer?.phone || q.buyer?.email}</small>
              </td>
              <td>{q.message}</td>
              <td>
                <select value={q.status} onChange={(e) => setStatus(q._id, e.target.value)}>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </td>
            </tr>
          ))}
          {inquiries.length === 0 && (
            <tr>
              <td colSpan="4" className="muted">
                No inquiries yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
