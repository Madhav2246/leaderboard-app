import React, { useState } from "react";
import axios from "axios";
import "../assets/style.css";
import logo from "../assets/images/acm-logo.jpg";
import Toast from "../components/Toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [toast, setToast] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", type: "" });

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setToast({ message: "📧 Reset link sent to your email!", type: "success" });
      setStatus({ message: "Check your inbox to reset your password.", type: "success" });
      setEmail("");
    } catch (err) {
      setToast({ message: "❌ Email not registered or server error", type: "error" });
      setStatus({ message: "Please enter a valid registered email.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {toast.message && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />
      )}

      <div className="auth-card">
        <img src={logo} alt="ACM Logo" className="auth-logo" />
        <h2 className="auth-title">Forgot Password</h2>

        {status.message && (
          <div className={status.type === "success" ? "auth-success" : "auth-error"}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
