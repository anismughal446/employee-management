import { useEffect, useState } from "react";
import { getEmployees, createEmployee, requestEmployee, updateEmployee, deleteEmployee } from "../api/employeeApi";

const emptyForm = { name: "", email: "", position: "", department: "", salary: "" };

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString();
}

function Employees({ department, isAuthenticated }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [savingEdit, setSavingEdit] = useState(false);

  const handleAuthError = (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.reload();
      return true;
    }
    return false;
  };

  const loadEmployees = () => {
    setLoading(true);
    getEmployees()
      .then((res) => {
        setEmployees(res.data);
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
        setError("Could not load employees. Is the backend reachable?");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEmployees();
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    if (!form.name || !form.email || !form.position) {
      setError("Name, email, and position are required.");
      return;
    }
    setSubmitting(true);
    try {
      if (isAuthenticated) {
        await createEmployee(form);
        setForm(emptyForm);
        setError("");
        loadEmployees();
      } else {
        const res = await requestEmployee(form);
        setForm(emptyForm);
        setError("");
        setSuccess(res.data.message || "Request submitted for admin approval.");
      }
    } catch (err) {
      if (handleAuthError(err)) return;
      console.error("Error submitting employee:", err);
      setError(err.response?.data?.error || "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      loadEmployees();
    } catch (err) {
      if (handleAuthError(err)) return;
      console.error("Error deleting employee:", err);
      setError("Failed to delete employee.");
    }
  };

  const startEdit = (emp) => {
    setEditingId(emp.id);
    setEditForm({
      name: emp.name || "",
      email: emp.email || "",
      position: emp.position || "",
      department: emp.department || "",
      salary: emp.salary != null ? emp.salary : "",
    });
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleUpdate = async (id) => {
    if (!editForm.name || !editForm.email || !editForm.position) {
      setError("Name, email, and position are required.");
      return;
    }
    setSavingEdit(true);
    try {
      await updateEmployee(id, editForm);
      setEditingId(null);
      setEditForm(emptyForm);
      setError("");
      loadEmployees();
    } catch (err) {
      if (handleAuthError(err)) return;
      console.error("Error updating employee:", err);
      setError(err.response?.data?.error || "Failed to update employee.");
    } finally {
      setSavingEdit(false);
    }
  };

  const visibleEmployees = department
    ? employees.filter((emp) => emp.department === department)
    : employees;

  const columnCount = isAuthenticated ? 8 : 6;

  return (
    <div>
      <h1>{department ? `${department} Employees` : "All Employees"}</h1>

      {error && <div className="error-banner">{error}</div>}
      {success && (
        <div style={{ background: "#f0fdf4", color: "#15803d", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px" }}>
          {success}
        </div>
      )}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>
          {isAuthenticated ? "Add Employee" : "Request to Add Employee"}
        </h3>
        {!isAuthenticated && (
          <p style={{ color: "#64748b", fontSize: "13px", marginTop: "-6px" }}>
            Your submission will be reviewed by an admin before it appears in the directory.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              placeholder="Position"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            />
            <input
              placeholder="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
            {isAuthenticated && (
              <input
                placeholder="Salary"
                type="number"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
              />
            )}
          </div>
          <button className="primary" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : isAuthenticated ? "Add Employee" : "Submit Request"}
          </button>
        </form>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading employees...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Department</th>
                {isAuthenticated && <th>Salary</th>}
                <th>Created</th>
                {isAuthenticated && <th></th>}
              </tr>
            </thead>
            <tbody>
              {visibleEmployees.length > 0 ? (
                visibleEmployees.map((emp) =>
                  isAuthenticated && editingId === emp.id ? (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>
                        <input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          value={editForm.position}
                          onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          value={editForm.department}
                          onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editForm.salary}
                          onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                        />
                      </td>
                      <td>{formatDate(emp.createdAt)}</td>
                      <td>
                        <button
                          className="primary"
                          onClick={() => handleUpdate(emp.id)}
                          disabled={savingEdit}
                          style={{ marginRight: "6px" }}
                        >
                          {savingEdit ? "Saving..." : "Save"}
                        </button>
                        <button onClick={cancelEdit}>Cancel</button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.position}</td>
                      <td>{emp.department || "-"}</td>
                      {isAuthenticated && <td>{emp.salary != null ? emp.salary : "-"}</td>}
                      <td>{formatDate(emp.createdAt)}</td>
                      {isAuthenticated && (
                        <td>
                          <button onClick={() => startEdit(emp)} style={{ marginRight: "6px" }}>
                            Update
                          </button>
                          <button className="danger" onClick={() => handleDelete(emp.id)}>
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan={columnCount}>No employees found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Employees;
