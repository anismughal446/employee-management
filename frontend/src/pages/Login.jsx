import { useState } from "react";
import { login } from "../api/employeeApi";

function Login({ onLogin, onCancel, onGoToSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await login(username, password);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      onLogin(res.data.username);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
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
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              margin: "0 auto 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            E
          </div>
          <h2 style={{ margin: 0, fontSize: "22px", color: "#0f172a" }}>Welcome back</h2>
          <p style={{ color: "#64748b", marginTop: "6px", fontSize: "14px" }}>
            Sign in to Employee System
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
          <div style={{ marginBottom: "20px" }}>
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

          {error ? (
            <button
              type="button"
              onClick={onCancel}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: "8px",
                border: "none",
                background: "#e2e8f0",
                color: "#334155",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                marginBottom: "10px",
              }}
            >
              Go Back
            </button>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
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
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#64748b" }}>
          Don't have an account?{" "}
          <span
            onClick={onGoToSignup}
            style={{ color: "#3b82f6", cursor: "pointer", fontWeight: 600 }}
          >
            Sign up as admin
          </span>
        </div>

        {!error && onCancel && (
          <div
            onClick={onCancel}
            style={{
              textAlign: "center",
              marginTop: "12px",
              fontSize: "13px",
              color: "#94a3b8",
              cursor: "pointer",
            }}
          >
            Back to home
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
