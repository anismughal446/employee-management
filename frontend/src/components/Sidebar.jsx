const departments = [
  "Engineering",
  "Sales",
  "HR",
  "Finance",
  "Marketing",
  "IT",
  "DevOps",
  "Systems",
  "AI/ML",
];

function Sidebar({ department, setDepartment }) {
  const linkStyle = (isActive) => ({
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "10px 12px",
    marginBottom: "6px",
    background: isActive ? "#334155" : "transparent",
    color: isActive ? "#fff" : "#cbd5e1",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  });

  return (
    <div className="sidebar">
      <h2>Employee Mgmt</h2>
      <button style={linkStyle(department === "")} onClick={() => setDepartment("")}>
        All Employees
      </button>
      {departments.map((dept) => (
        <button
          key={dept}
          style={linkStyle(department === dept)}
          onClick={() => setDepartment(dept)}
        >
          {dept}
        </button>
      ))}
    </div>
  );
}

export default Sidebar;
