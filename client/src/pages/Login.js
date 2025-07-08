import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api"; // ✅ Uses the configured API with base URL

import "../assets/style.css";
import logo from "../assets/images/acm-logo.jpg";
import Toast from "../components/Toast";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/api/auth/login", form); // ✅ Uses API proxy
      const user = res.data.user;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      setToastType("success");
      setToastMessage("✅ Login successful! Redirecting...");

      setTimeout(() => {
        if (user.role === "admin") navigate("/admin");
        else if (user.role === "mentor") navigate("/mentor");
        else navigate("/dashboard");
      }, 2000);
    } catch {
      setError("Login failed. Please check your credentials.");
      setToastType("error");
      setToastMessage("❌ Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage("")}
        />
      )}
      <div className="auth-card">
        <img src={logo} alt="ACM Logo" className="auth-logo" />
        <h2 className="auth-title">Login</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : "Login"}
          </button>
        </form>

        <div className="auth-link">
          Don’t have an account? <Link to="/register">Register</Link><br />
          <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
}
