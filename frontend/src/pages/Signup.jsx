import { useState } from "react";
import { registerAdmin } from "../api/employeeApi";

function Signup({ onGoToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerAdmin(username, password);
      setSuccess(res.data.message || "Registration submitted for approval.");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)",
        fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
      }}
    >
      <div
        style={{
          width: "360px",
          padding: "40px 36px",
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              margin: "0 auto 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            +
          </div>
          <h2 style={{ margin: 0, fontSize: "22px", color: "#0f172a" }}>Admin Sign Up</h2>
          <p style={{ color: "#64748b", marginTop: "6px", fontSize: "14px" }}>
            Requires approval from an existing admin
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              color: "#b91c1c",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {success ? (
          <div>
            <div
              style={{
                background: "#f0fdf4",
                color: "#15803d",
                padding: "14px",
                borderRadius: "8px",
                fontSize: "14px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {success}
            </div>
            <button
              type="button"
              onClick={onGoToLogin}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "13px", color: "#334155", fontWeight: 500 }}>Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  marginTop: "6px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                }}
              />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "13px", color: "#334155", fontWeight: 500 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  marginTop: "6px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", color: "#334155", fontWeight: 500 }}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  marginTop: "6px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {submitting ? "Submitting..." : "Request Admin Access"}
            </button>
          </form>
        )}

        {!success && (
          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#64748b" }}>
            Already have an account?{" "}
            <span
              onClick={onGoToLogin}
              style={{ color: "#3b82f6", cursor: "pointer", fontWeight: 600 }}
            >
              Sign in
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;
