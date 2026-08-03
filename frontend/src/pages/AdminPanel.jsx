import { useEffect, useState } from "react";
import {
  getPendingEmployees,
  approveEmployee,
  deleteEmployee,
  getPendingUsers,
  approveUser,
  rejectUser,
} from "../api/employeeApi";

function AdminPanel() {
  const [pendingEmployees, setPendingEmployees] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAll = () => {
    setLoading(true);
    Promise.all([getPendingEmployees(), getPendingUsers()])
      .then(([empRes, userRes]) => {
        setPendingEmployees(empRes.data);
        setPendingUsers(userRes.data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load pending items.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleApproveEmployee = async (id) => {
    try {
      await approveEmployee(id);
      loadAll();
    } catch (err) {
      setError("Failed to approve employee.");
    }
  };

  const handleRejectEmployee = async (id) => {
    try {
      await deleteEmployee(id);
      loadAll();
    } catch (err) {
      setError("Failed to reject employee.");
    }
  };

  const handleApproveUser = async (id) => {
    try {
      await approveUser(id);
      loadAll();
    } catch (err) {
      setError("Failed to approve user.");
    }
  };

  const handleRejectUser = async (id) => {
    try {
      await rejectUser(id);
      loadAll();
    } catch (err) {
      setError("Failed to reject user.");
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Pending Employee Requests</h3>
        {loading ? (
          <p>Loading...</p>
        ) : pendingEmployees.length === 0 ? (
          <p style={{ color: "#64748b" }}>No pending employee requests.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Department</th>
                <th>Salary</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pendingEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.position}</td>
                  <td>{emp.department || "-"}</td>
                  <td>{emp.salary != null ? emp.salary : "-"}</td>
                  <td>
                    <button
                      className="primary"
                      onClick={() => handleApproveEmployee(emp.id)}
                      style={{ marginRight: "6px" }}
                    >
                      Approve
                    </button>
                    <button className="danger" onClick={() => handleRejectEmployee(emp.id)}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Pending Admin Signups</h3>
        {loading ? (
          <p>Loading...</p>
        ) : pendingUsers.length === 0 ? (
          <p style={{ color: "#64748b" }}>No pending admin signups.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Requested</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{new Date(u.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="primary"
                      onClick={() => handleApproveUser(u.id)}
                      style={{ marginRight: "6px" }}
                    >
                      Approve
                    </button>
                    <button className="danger" onClick={() => handleRejectUser(u.id)}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
