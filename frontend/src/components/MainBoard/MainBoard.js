import withAuth from "../../withAuth";
import "./MainBoard.css";
import Navbar from "../Navbar/Navbar";
import MainBoardContent from "./MainBoardContent";
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { format, addMonths, subMonths } from "date-fns";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import ProjectSidebar from "../ProjectSidebar/ProjectSidebar";
import { useSelector, useDispatch } from "react-redux";
import { setEmployees } from "../../reduxData/helper/employees";
import projects, { setProjects } from "../../reduxData/helper/projects";
import { setSupervisor } from "../../reduxData/helper/supervisor";
import { setSeeAllEmployees } from "../../reduxData/helper/seeAllEmployees";

function DatePickerOpenTo({ selectedDate, setSelectedDate }) {
  const handleDateChange = (event) => {
    const value = event.target.value;
    const dateParts = value.split("-");

    if (dateParts.length !== 2) {
      return;
    }

    const year = Number(dateParts[0]);
    const month = Number(dateParts[1]) - 1; // month is 0-based

    if (!isNaN(year) && !isNaN(month)) {
      setSelectedDate(new Date(year, month));
    }
  };

  const incrementMonth = () => {
    setSelectedDate((prevDate) => addMonths(prevDate, 1));
  };

  const decrementMonth = () => {
    setSelectedDate((prevDate) => subMonths(prevDate, 1));
  };

  return (
    <div className="dataPickerNav">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "auto 0px",
        }}
      >
        <IconButton onClick={decrementMonth}>
          <ArrowBackIos />
        </IconButton>
        <TextField
          label="Year and Month"
          type="month"
          value={format(selectedDate, "yyyy-MM")}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <IconButton onClick={incrementMonth}>
          <ArrowForwardIos />
        </IconButton>
      </div>
    </div>
  );
}

function MainBoard() {
  const Dispatch = useDispatch();
  const employeeSideBarList = useSelector((state) => state.employees.value);
  const seeAllEmployees = useSelector((state) => state.seeAllEmployees.value);
  const supervisor = useSelector((state) => state.supervisor.value);

  setInterval(async () => {
    try {
      let data = await fetch(
        `/api/apiRefresh`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((res) => res.json());
      console.log(data); // <----- nur zur Überprüfung
      localStorage.setItem("token", data.token);
    }
    catch (error) {
      console.log('Refresh token Error: ',error);
    }
  }, 600000); // <--- 10min

  const fetchAllEmployees = async (ID) => {
    try {
      let data = await fetch(
        `/api/employee/viewall?seeAllEmployees=${seeAllEmployees}&supervisor_id=${ID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((res) => res.json());
      console.log(data); // <----- nur zur Überprüfung
      Dispatch(setEmployees(data.employeesData));
    }
    catch (error) {
      console.log('Error fetching employees: ',error);
    }
  };
  
  const fetchAllProjects = async (ID) => {
    try {
      let data = await fetch(`/api/project/viewall?supervisor_id=${ID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => res.json());
      Dispatch(setProjects(data.projectsData));
      console.log(data); // <----- zur  Überprüfung
    } 
    catch (error) {
      console.log('Error fetching projects: ', error);
    }
  };

  const fetchSupervisor = async (ID) => {
    try {
      // let data = await fetch(`/api/supervisor/view`, { // <--- original
      let data = await fetch(`/api/supervisor/view?supervisor_id=${ID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => res.json()).catch((err) => console.log("found error: ",err));
      console.log(data);

      if (data?.supervisorData?.ID) {
        Dispatch(setSupervisor(data.supervisorData));
        return data.supervisorData.ID; // &&seeAllEmployees && employeeSideBarList&&supervisor;  // <-----------------
        //return null;
      } 
      else {

        localStorage.removeItem("token");
        
        window.location.reload();
        
        console.error('Supervisor data or ID is undefined', data);
        return null;
      }
    } catch (error) {
      console.error('Error fetching supervisor data:', error);
      return null;
    }
  };
  
  const [employeeSelected, setEmployeeSelected] = useState([]);

  const handleEmployeeSelectedChange = (id) => {
    let temp = [...employeeSelected];
    let elExists = false;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].ID === id) {
        elExists = true;
        break;
      }
    }
    if (!elExists) {
      temp.push(employeeSideBarList.filter((el) => el.ID === id)[0]); // <--- original
      setEmployeeSelected(temp);
    }
  };
  
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetches = async () => {
      let ID = await fetchSupervisor();
      await fetchAllEmployees(ID);
      await fetchAllProjects(ID);
    };
    fetches();
  }, []);

  return (
    <div className="MainBoard">
      <Navbar />
      <DatePickerOpenTo
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <div className="PageContent">
        <EmployeeSidebar
          selectedDate={selectedDate}
          handleEmployeeSelectedChange={handleEmployeeSelectedChange}
        />
        <MainBoardContent
          selectedDate={selectedDate}
          employeeSelected={employeeSelected}
          setEmployeeSelected={setEmployeeSelected}
        />
        <ProjectSidebar/>
      </div>
    </div>
  );
}

export default withAuth(MainBoard);