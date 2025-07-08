import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api"; // ✅ use centralized API
import "../assets/style.css";
import logo from "../assets/images/acm-logo.jpg";
import Toast from "../components/Toast";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [toast, setToast] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setStatus({ message: "❌ Passwords do not match", type: "error" });
      return;
    }

    try {
      setLoading(true);
      await api.post(`/api/auth/reset-password/${token}`, { password }); // ✅ updated
      setToast({ message: "✅ Password reset successful! Redirecting...", type: "success" });
      setStatus({ message: "", type: "" });

      setTimeout(() => navigate("/"), 2000);
    } catch {
      setStatus({ message: "❌ Invalid or expired token", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "" })}
        />
      )}

      <div className="auth-card">
        <img src={logo} alt="ACM Logo" className="auth-logo" />
        <h2 className="auth-title">Reset Password</h2>

        {status.message && (
          <div className={status.type === "success" ? "auth-success" : "auth-error"}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
