import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Employees from "./pages/Employees";
import Login from "./pages/Login";

function App() {
  const [department, setDepartment] = useState("");
  const [username, setUsername] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      setUsername(savedUser);
    }
  }, []);

  const handleLogin = (name) => {
    setUsername(name);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
  };

  if (showLogin && !username) {
    return <Login onLogin={handleLogin} onCancel={() => setShowLogin(false)} />;
  }

  return (
    <div className="app-layout">
      <Sidebar department={department} setDepartment={setDepartment} />
      <div className="main-content">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: "12px",
            gap: "12px",
          }}
        >
          {username ? (
            <>
              <span style={{ color: "#64748b", fontSize: "14px" }}>Signed in as {username}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="primary" onClick={() => setShowLogin(true)}>
              Login
            </button>
          )}
        </div>
        <Employees department={department} isAuthenticated={!!username} />
      </div>
    </div>
  );
}

export default App;
