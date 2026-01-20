import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { SketchPicker } from "react-color";
import ReactSwitch from "react-switch";
import "reactjs-popup/dist/index.css";
import { setProjects } from "../../../reduxData/helper/projects";
import { setEmployees } from "../../../reduxData/helper/employees";
import DialogActions from "@mui/material/DialogActions";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";

export default function EditAssignmentDialog({
  openEditAssignmentModal,
  handleEditAssignmentCloseModal,
  assignId,
  projectName,
  assignment_Duration,
  NUMBER_OF_DAYS_PER_WEEK,
  NUMBER_OF_WEEKS_TOTAL,
  userID,
  week,
  TYPE,
  projectID,
}) {
  const Dispatch = useDispatch();
  const seeAllEmployees = useSelector((state) => state.seeAllEmployees.value);
  const supervisor = useSelector((state) => state.supervisor.value);
  const fetchAllEmployees = async () => {
    let data = await fetch(
      `/api/employee/viewall?seeAllEmployees=${!seeAllEmployees}&supervisor_id=${
        supervisor.ID
      }`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).then((res) => res.json());
    Dispatch(setEmployees(data.employeesData));
  };

  const employees = useSelector((state) => state.employees.value);
  const [assignmentType, setAssignmentType] = useState(TYPE);

  const handleChangeAssignmentType = (event) => {
    setAssignmentType(event.target.value);
  };
  const [assignmentDuration, setAssignmentDuration] = useState(
    assignment_Duration / 8
  );

  const handleChangeAssignmentDuration = (event) => {
    setAssignmentDuration(event.target.value);
  };

  const [daysPerWeek, setDaysPerWeek] = useState(NUMBER_OF_DAYS_PER_WEEK);
  const handleChangeDaysPerWeek = (event) => {
    setDaysPerWeek(event.target.value);
  };

  const [weekNumber, setWeekNumber] = useState(NUMBER_OF_WEEKS_TOTAL);
  const handleChangeWeekNumber = (event) => {
    setWeekNumber(event.target.value);
  };

  function freeWeekFinder(firstDayOfWeek, assignments) {
    let res = 56;
    for (let index = 0; index < assignments.length; index++) {
      let temp = assignments[index].weeks.filter(
        (el) =>
          new Date(el.START_WEEK)
            .toLocaleDateString("en-GB")
            .replaceAll("/", "-") ===
            `${firstDayOfWeek.startDay}-${firstDayOfWeek.startMonth}-${firstDayOfWeek.year}` &&
          assignments[index].ID !== assignId
      );
      if (temp.length > 0) {
        res -= temp[0].DURATION;
      }
    }
    return res;
  }

  const handleSaveAndclose = async (e) => {
    handleEditAssignmentCloseModal(e);
    const getNextWeek = (anyweek) => {
      let date = new Date(
        anyweek.year,
        anyweek.startMonth - 1,
        anyweek.startDay
      );
      date.setDate(date.getDate() + 7);
      return {
        year: date.getFullYear(),
        startDay: date.getDate(),
        startMonth: date.getMonth() + 1,
      };
    };
    let tempAssignmentDuration = parseInt(assignmentDuration) * 8;
    let number_of_days_per_week = parseInt(daysPerWeek) * 8;
    let number_of_weeks_total = parseInt(weekNumber);
    let tempweek = {
      year: week.year,
      startDay: week.startDay,
      startMonth: week.startMonth,
    };
    let assignments = employees.filter((el) => el.ID === userID)[0].assignments;
    let weeksResult = [];
    let assignmentData;
    if (assignmentType === "bulk") {
      while (tempAssignmentDuration > 0) {
        let tempfreeTime = freeWeekFinder(tempweek, assignments);
        if (tempfreeTime > 0) {
          weeksResult.push({
            start_week: `${tempweek.startDay}-${tempweek.startMonth}-${tempweek.year}`,
            duration: Math.min(tempAssignmentDuration, tempfreeTime),
          });
          tempAssignmentDuration -= Math.min(
            tempAssignmentDuration,
            tempfreeTime
          );
        }
        tempweek = getNextWeek(tempweek);
      }
      assignmentData = {
        assignId: parseInt(assignId),
        project_id: parseInt(projectID),
        employee_id: parseInt(userID),
        type: assignmentType,
        duration: parseInt(assignmentDuration),
        number_of_days_per_week: 0,
        number_of_weeks_total: 0,
        weeks: weeksResult,
      };
      // && number_of_weeks_total > 0 && number_of_days_per_week > 0
      // && tempAssignmentDuration > 0
    } else if (assignmentType === "weekly") {
      while (number_of_weeks_total > 0) {
        let tempfreeTime = freeWeekFinder(tempweek, assignments);
        if (tempfreeTime >= number_of_days_per_week) {
          weeksResult.push({
            start_week: `${tempweek.startDay}-${tempweek.startMonth}-${tempweek.year}`,
            duration: number_of_days_per_week,
          });
          number_of_weeks_total--;
          //tempAssignmentDuration -= number_of_days_per_week; // Reduce the remaining duration
        }
        tempweek = getNextWeek(tempweek);
      }
      assignmentData = {
        assignId: parseInt(assignId),
        project_id: parseInt(projectID),
        employee_id: parseInt(userID),
        type: assignmentType,
        duration: 0,
        number_of_days_per_week: parseInt(daysPerWeek),
        number_of_weeks_total: parseInt(weekNumber),
        weeks: weeksResult,
      };
    }
    try {
      assignmentData = {
        assignId: parseInt(assignId),
        project_id: parseInt(projectID),
        employee_id: parseInt(userID),
        type: assignmentType,
        duration: parseInt(assignmentDuration),
        number_of_days_per_week: parseInt(daysPerWeek),
        number_of_weeks_total: parseInt(weekNumber),
        weeks: weeksResult,
      };
      await fetch("/api/assignment/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(assignmentData),
      });
      await fetchAllEmployees();
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteAssignment = async (e) => {
    handleEditAssignmentCloseModal(e);
    try {
      await fetch("/api/assignment/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ assignID: assignId }),
      });
      await fetchAllEmployees();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog
      open={openEditAssignmentModal}
      onClose={handleEditAssignmentCloseModal}
    >
      <DialogTitle>
        editing {projectName} for{" "}
        {employees.filter((el) => el.ID === userID)[0].FIRST_NAME} on week{" "}
        {week.startDay}/{week.startMonth} - {week.endDay}/{week.endMonth}
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth style={{ marginTop: "10px" }}>
          <InputLabel id="assignmentType">Assignment Type</InputLabel>
          <Select
            labelId="assignmentType"
            id="assignmentType"
            value={assignmentType}
            label="Assignment Type"
            onChange={handleChangeAssignmentType}
          >
            <MenuItem value={"bulk"}>Bulk</MenuItem>
            <MenuItem value={"weekly"}>Weekly</MenuItem>
          </Select>
        </FormControl>
        {assignmentType === "bulk" ? (
          <FormControl fullWidth style={{ marginTop: "10px" }}>
            <TextField
              type="number"
              value={assignmentDuration}
              label="Assignment Duration"
              onChange={handleChangeAssignmentDuration}
              InputProps={{
                inputProps: { min: 1, step: 0.5 },
              }}
            ></TextField>
          </FormControl>
        ) : assignmentType === "weekly" ? (
          <>
            <FormControl fullWidth style={{ marginTop: "10px" }}>
              <TextField
                type="number"
                value={daysPerWeek}
                label="how many days per week"
                onChange={handleChangeDaysPerWeek}
                InputProps={{
                  inputProps: { min: 0.5, max: 5, step: 0.5 },
                }}
              ></TextField>
            </FormControl>
            <FormControl fullWidth style={{ marginTop: "10px" }}>
              <TextField
                type="number"
                value={weekNumber}
                label="for how many weeks"
                onChange={handleChangeWeekNumber}
                InputProps={{
                  inputProps: { min: 1 },
                }}
              ></TextField>
            </FormControl>
            <p style={{ color: 'red'}}>Note: text field "how many days per week" must be filled in!</p>
          </>
        ) : (
          <></>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteAssignment}>Delete</Button>
        <Button onClick={handleEditAssignmentCloseModal}>Cancel</Button>
        <Button onClick={handleSaveAndclose}>save</Button>
      </DialogActions>
    </Dialog>
  );
}