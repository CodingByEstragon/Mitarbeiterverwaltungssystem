import Popup from "reactjs-popup";
import React, { useEffect, useState, useCallback } from "react";
import "reactjs-popup/dist/index.css";
import "./SupervisorDetails.css";
import Button from "@mui/material/Button";
import ReactSwitch from "react-switch";
import LogoutIcon from "@mui/icons-material/Logout";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSeeAllEmployees } from "../../../reduxData/helper/seeAllEmployees";
import { setEmployees } from "../../../reduxData/helper/employees";
import MenuIcon from "@mui/icons-material/Menu";
import { setSupervisor } from "../../../reduxData/helper/supervisor";
import InitialsAvatar from "react-initials-avatar";
import "react-initials-avatar/lib/ReactInitialsAvatar.css";

function SupervisorDetails() {
  const history = useHistory();
  const Dispatch = useDispatch();
  const [supervisorSelected, setSupervisorSelected] = useState({});
  const seeAllEmployees = useSelector((state) => state.seeAllEmployees.value);
  const supervisor = useSelector((state) => state.supervisor.value);

  // ------------------------------------------------------------------------------------
  // original

  // const handleChangeSeeAllEmployees = async () => {
  //   let data = await fetch(
  //     `/api/employee/viewall?seeAllEmployees=${!seeAllEmployees}&supervisor_id=${
  //       supervisor.ID
  //     }`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     }
  //   ).then((res) => res.json());
  //   Dispatch(setSeeAllEmployees(!seeAllEmployees));
  //   Dispatch(setEmployees(data.employeesData));
  // };
  // ------------------------------------------------------------------------------------

  // neu hinzugefügt zur Überprüfung
  // const handleChangeSeeAllEmployees = async () => {
  //   // if (!supervisor) {
  //   //   console.error('Supervisor data is undefined');
  //   //   return;
  //   // }
  //   let data = await fetch(
  //     `/api/employee/viewall?seeAllEmployees=${!seeAllEmployees}&supervisor_id=${
  //       supervisor.ID
  //     }`,  // <----- original wie es vorher war

  //     //`/api/employee/viewall?seeAllEmployees=${!seeAllEmployees}&supervisor_id=${supervisor?.ID}&supervisor_firstname=${supervisor?.FIRST_NAME}`,
  //     //`/api/employee/viewall?seeAllEmployees=${!seeAllEmployees}&supervisor_id=${supervisor?.ID || supervisor?.FIRST_NAME}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     }
  //   ).then((res) => res.json());
  //   console.log(data); // <----- nur für die Überprüfung
  //   Dispatch(setSeeAllEmployees(!seeAllEmployees));
  //   Dispatch(setEmployees(data.employeesData));
  // };


  const handleChangeSeeAllEmployees = async () => {
    try {
      const supervisorID = supervisor?.ID || "";
      const response = await fetch(
        `/api/employee/viewall?seeAllEmployees=${!seeAllEmployees}&supervisor_id=${supervisorID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      Dispatch(setSeeAllEmployees(!seeAllEmployees));
      Dispatch(setEmployees(data.employeesData));
    } catch (error) {
      console.error('Error toggling "See All Employees":', error);
    }
  };



  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // original 

  // const fetchSupervisor = async () => {
  //   let data = await fetch(`/api/supervisor/view`, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   }).then((res) => res.json());
  //   Dispatch(setSupervisor(data.supervisorData));
  //   setSupervisorSelected(data.supervisorData);
  //   return data.supervisorData;
  // };

  // useEffect(() => {
  //   const fetches = async () => {
  //     let supervisorData = await fetchSupervisor();
  //     if(supervisorData){
  //       setSupervisorSelected(supervisorData);
  //     }
  //   };
  //   fetches();
  // }, []);

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  // -----------------------------------------------------------------------------------------
  // neu hinzugefügt


  // const fetchSupervisor = useCallback(async () => {
  //   try {
  //     const response = await fetch(`/api/supervisor/view`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     const data = await response.json();
  //     dispatch(setSupervisor(data.supervisorData));
  //     setSupervisorSelected(data.supervisorData);
  //     return data.supervisorData;
  //   } catch (error) {
  //     console.error('Error fetching supervisor data:', error);
  //     return null;
  //   }
  // }, [dispatch]);

  // useEffect(() => {
  //   const fetches = async () => {
  //     const supervisorData = await fetchSupervisor();
  //     if (supervisorData) {
  //       setSupervisorSelected(supervisorData);
  //     }
  //   };
  //   fetches();
  // }, [fetchSupervisor]);


  const fetchSupervisor = useCallback(async () => {
    let data = await fetch(`/api/supervisor/view`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());
    Dispatch(setSupervisor(data.supervisorData));
    setSupervisorSelected(data.supervisorData);
    
    return data.supervisorData;
  }, [Dispatch]);

  useEffect(() => {
    const fetches = async () => {
      let supervisorData = await fetchSupervisor();

      if (supervisorData) {
        setSupervisorSelected(supervisorData);
      }
      // -------------------------------------------------------------------------------------------------------
      // const supervisorID = decoded.ID; // Change this to the correct field in your decoded token
      // if (supervisorID === 1 || supervisorID === 3) {
      //   req.specialAccess = true; // Set a flag indicating special access
      // }

      // nue hinzugefügt 06.12.
      if(supervisorData.ID === 1 || supervisorData.ID === 2 || supervisorData.ID === 3 || supervisorData.ID === 21) {
        console.log("hello supervisor with the number: " + supervisorData.ID);
        history.push("/main-board");

      } else {
        console.log("er ist kein supervisor!");
        history.push("/login");
      }
      // -------------------------------------------------------------------------------------------------------
    };
    // -----------------------------------------------------------------------------------------

    // if(localStorage.getItem("token") && !supervisorSelected.ID){
    //   history.push("/login");
    // } else{
    //   history.push("/main-board");
    // }
    // -----------------------------------------------------------------------------------------
    fetches();
  }, [fetchSupervisor]);
  return (
    <Popup
      trigger={<MenuIcon style={{ cursor: "pointer", fontSize: "50px" }} />}
      position="bottom right"
      contentStyle={{ width: "230px" }}
    >
      <div className="card">
        <div className="card-body">
          {supervisorSelected && supervisorSelected?.ID && supervisorSelected?.FIRST_NAME && (
            <>
              <InitialsAvatar
                className="supervisorAvatar"
                name={
                  supervisorSelected.FIRST_NAME + " " + supervisorSelected.LAST_NAME
                }
              />
              <h5 className="text-center mb-0">
                {supervisorSelected.FIRST_NAME + " " + supervisorSelected.LAST_NAME}
              </h5>
              <p className="text-center mb-2">{supervisorSelected.EMAIL}</p>
            </>
          )}
          <hr />
          <div className="filterEmployees">
            <p
              style={{
                color: "#bebebe",
                fontWeight: "bold",
                fontSize: 12,
              }}
            >
              See all employees:
            </p>
            <ReactSwitch className="toggle-Button"
              checked={seeAllEmployees}
              onChange={handleChangeSeeAllEmployees}
              trackcolor={{ true: "#01a89e", false: "grey" }}
            />
          </div>
          <hr />
          <div className="d-grid">
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={() => {
                localStorage.removeItem("token");
                history.push("/login");
              }}
              style={{ border: "solid 2px #01a89e", color: "#01a89e" }}
            >
              logout
            </Button>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default SupervisorDetails;