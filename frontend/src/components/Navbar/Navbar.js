import "./Navbar.css";
import logo from "../assets/logo.svg";
import AddEmployeeForm from "../utils/AddEmployeeForm/AddEmployeeForm.js";
import AddProjectForm from "../utils/AddProjectForm/AddProjectForm";
import SupervisorDetails from "../utils/SupervisorDetails/SupervisorDetails";

function Navbar() {
  return (
    <div className="Navbar">
      <img
        src={logo}
        height={40}
        width={250}
        style={{ margin: "auto 0px" }}
        alt="nav-logo"
        id="logo"
      />
      <div className="rightSideNav">
        <AddEmployeeForm />
        <AddProjectForm />
        <SupervisorDetails />
      </div>
    </div>
  );
}

export default Navbar;
