import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Employees from "./pages/Employees";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminPanel from "./pages/AdminPanel";

function App() {
  const [department, setDepartment] = useState("");
  const [username, setUsername] = useState(null);
  const [view, setView] = useState("main");

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      setUsername(savedUser);
    }
  }, []);

  const handleLogin = (name) => {
    setUsername(name);
    setView("main");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    setView("main");
  };

  if (view === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onCancel={() => setView("main")}
        onGoToSignup={() => setView("signup")}
      />
    );
  }

  if (view === "signup") {
    return <Signup onGoToLogin={() => setView("login")} />;
  }

  return (
    <div className="app-layout">
      <Sidebar
        department={department}
        setDepartment={(d) => {
          setDepartment(d);
          setView("main");
        }}
        isAuthenticated={!!username}
        onAdminPanel={() => setView("admin")}
      />
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
            <button className="primary" onClick={() => setView("login")}>
              Login
            </button>
          )}
        </div>
        {view === "admin" && username ? (
          <AdminPanel />
        ) : (
          <Employees department={department} isAuthenticated={!!username} />
        )}
      </div>
    </div>
  );
}

export default App;
