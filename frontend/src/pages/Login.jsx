import { useState } from "react";
import { login } from "../api/employeeApi";

function Login({ onLogin, onCancel }) {
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
        background: "#f4f5f7",
      }}
    >
      <div
        className="card"
        style={{ width: "320px", padding: "32px", background: "#fff", borderRadius: "8px" }}
      >
        <h2 style={{ marginTop: 0, textAlign: "center" }}>Employee System</h2>
        <p style={{ textAlign: "center", color: "#64748b", marginTop: "-8px" }}>Sign in</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>
          <button
            className="primary"
            type="submit"
            disabled={submitting}
            style={{ width: "100%", marginBottom: "8px" }}
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} style={{ width: "100%" }}>
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
