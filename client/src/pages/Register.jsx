import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "buyer" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-box">
      <h2>Create your account</h2>
      <form onSubmit={submit} className="form">
        <input placeholder="Full name" required value={form.name} onChange={set("name")} />
        <input type="email" placeholder="Email" required value={form.email} onChange={set("email")} />
        <input placeholder="Phone (optional)" value={form.phone} onChange={set("phone")} />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          required
          minLength={6}
          value={form.password}
          onChange={set("password")}
        />
        <select value={form.role} onChange={set("role")}>
          <option value="buyer">I'm looking for a property (Buyer)</option>
          <option value="agent">I want to list properties (Agent)</option>
        </select>
        {error && <p className="error">{error}</p>}
        <button className="btn">Sign up</button>
      </form>
      <p className="muted">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
