import { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./AddEmployeeForm.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { setEmployees } from "../../../reduxData/helper/employees";

function AddEmployeeForm({}) {
  const Dispatch = useDispatch();
  const seeAllEmployees = useSelector((state) => state.seeAllEmployees.value);
  const supervisor = useSelector((state) => state.supervisor.value);
  const [firstName, setFirstName] = useState("");
  let handleChangeFirstName = (e) => {
    setFirstName(e.target.value);
  };
  const [lastName, setLasttName] = useState("");
  let handleChangeLastName = (e) => {
    setLasttName(e.target.value);
  };
  const [email, setEmail] = useState("");
  let handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  // const [warning, setWarning] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const fetchAllEmployees = async () => {
    let data = await fetch(
      `/api/employee/viewall?seeAllEmployees=${seeAllEmployees}&supervisor_id=${supervisor.ID}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).then((res) => res.json());
    Dispatch(setEmployees(data.employeesData));
  };

  const saveAddEmployee = async (close) => {

    if (!firstName || !lastName || !email) {
      // setWarning("Please fill in all fields!");
      if (!firstName) setFirstNameError(true);
      if (!lastName) setLastNameError(true);
      if (!email) setEmailError(true);
      return;
    }
    setFirstNameError(false);
    setLastNameError(false);
    setEmailError(false);

    let employeeData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      supervisor_id: supervisor.ID,
    };
    await fetch("/api/employee/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(employeeData),
    });

    await fetchAllEmployees();
    setFirstName("");
    setLasttName("");
    setEmail("");
    // setWarning("");
    close();
  };

  return (
    <Popup
      trigger={
        <p href="#" className="navigationText">
          Add Employee
        </p>
      }
      position="bottom right"
    >
      {(close) => (
        <div className="Modal">
          <div className="inputfields">
            <TextField
              onChange={handleChangeFirstName}
              label="First Name*"
              variant="outlined"
              placeholder="first name"
              error={firstNameError}
              helperText={firstNameError ? "Required" : ""}
            />
          </div>
          <div className="inputfields">
            <TextField
              onChange={handleChangeLastName}
              label="Last Name*"
              variant="outlined"
              placeholder="last name"
              error={lastNameError}
              helperText={lastNameError ? "Required" : ""}
            />
          </div>
          <div className="inputfields">
            <TextField
              onChange={handleChangeEmail}
              label="Email*"
              variant="outlined"
              placeholder="example@exmaple.example"
              error={emailError}
              helperText={emailError ? "Required" : ""}
            />
          </div>
          <Button
            onClick={() => saveAddEmployee(close)}
            variant="contained"
            style={{ backgroundColor: "#01a89e", fontSize: "16px" }}
          >
            Save
          </Button>
        </div>
      )}
    </Popup>
  );
}
export default AddEmployeeForm;
