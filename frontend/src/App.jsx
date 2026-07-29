import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Employees from "./pages/Employees";

function App() {
  const [department, setDepartment] = useState("");

  return (
    <div className="app-layout">
      <Sidebar department={department} setDepartment={setDepartment} />
      <div className="main-content">
        <Employees department={department} />
      </div>
    </div>
  );
}

export default App;
