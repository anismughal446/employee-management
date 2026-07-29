import { useEffect, useState } from "react";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../api/employeeApi";

const emptyForm = { name: "", email: "", position: "", department: "", salary: "" };

function Employees({ department }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [savingEdit, setSavingEdit] = useState(false);

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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.position) {
      setError("Name, email, and position are required.");
      return;
    }
    setSubmitting(true);
    try {
      await createEmployee(form);
      setForm(emptyForm);
      setError("");
      loadEmployees();
    } catch (err) {
      console.error("Error creating employee:", err);
      setError(err.response?.data?.error || "Failed to create employee.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      loadEmployees();
    } catch (err) {
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
      console.error("Error updating employee:", err);
      setError(err.response?.data?.error || "Failed to update employee.");
    } finally {
      setSavingEdit(false);
    }
  };

  const visibleEmployees = department
    ? employees.filter((emp) => emp.department === department)
    : employees;

  return (
    <div>
      <h1>{department ? `${department} Employees` : "All Employees"}</h1>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Add Employee</h3>
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
            <input
              placeholder="Salary"
              type="number"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
            />
          </div>
          <button className="primary" type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add Employee"}
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
                <th>Salary</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visibleEmployees.length > 0 ? (
                visibleEmployees.map((emp) =>
                  editingId === emp.id ? (
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
                      <td>{emp.salary != null ? emp.salary : "-"}</td>
                      <td>
                        <button onClick={() => startEdit(emp)} style={{ marginRight: "6px" }}>
                          Update
                        </button>
                        <button className="danger" onClick={() => handleDelete(emp.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan="7">No employees found</td>
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
