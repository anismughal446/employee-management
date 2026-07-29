const DEPARTMENTS = ["IT", "HR", "Finance", "Sales"];

function Sidebar({ department, setDepartment }) {
  return (
    <div className="sidebar">
      <h2>Employee System</h2>

      <button
        className={department === "" ? "active" : ""}
        onClick={() => setDepartment("")}
      >
        All Employees
      </button>

      {DEPARTMENTS.map((dep) => (
        <button
          key={dep}
          className={department === dep ? "active" : ""}
          onClick={() => setDepartment(dep)}
        >
          {dep}
        </button>
      ))}
    </div>
  );
}

export default Sidebar;
