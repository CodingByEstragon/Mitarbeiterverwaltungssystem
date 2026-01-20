import { useState } from "react";
import "./AddAssignmentForm.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { setEmployees } from "../../../reduxData/helper/employees";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import WarningIcon from "@mui/icons-material/Warning";
import InputAdornment from "@mui/material/InputAdornment";
import { Height } from "@mui/icons-material";

function AddAssignmentForm({
  projectInfo,
  userID,
  week,
  openModal,
  handleCloseModal,
  busyTimePercentage,
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
  const [assignmentType, setAssignmentType] = useState("");
  const handleChangeAssignmentType = (event) => {
    setAssignmentType(event.target.value);
  };
  const [assignmentDuration, setAssignmentDuration] = useState("");
  const handleChangeAssignmentDuration = (event) => {
    setAssignmentDuration(event.target.value);
  };

  const [daysPerWeek, setDaysPerWeek] = useState("");
  const handleChangeDaysPerWeek = (event) => {
    setDaysPerWeek(event.target.value);
  };

  const [weekNumber, setWeekNumber] = useState("");
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
          `${firstDayOfWeek.startDay}-${firstDayOfWeek.startMonth}-${firstDayOfWeek.year}`
      );
      if (temp.length > 0) {
        res -= temp[0].DURATION;
      }
    }
    return res;
  }

  const handleSaveAndclose = async () => {
    handleCloseModal();
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
    } else if (assignmentType === "weekly") {
      while (number_of_weeks_total > 0) {
        let tempfreeTime = freeWeekFinder(tempweek, assignments);
        if (tempfreeTime >= number_of_days_per_week) {
          weeksResult.push({
            start_week: `${tempweek.startDay}-${tempweek.startMonth}-${tempweek.year}`,
            duration: number_of_days_per_week,
          });
          number_of_weeks_total--;
        }
        tempweek = getNextWeek(tempweek);
      }
    }
    try {
      let assignmentData = {
        project_id: parseInt(projectInfo.ID),
        employee_id: parseInt(userID),
        type: assignmentType,
        duration: parseInt(assignmentDuration) * 8,
        number_of_days_per_week: parseInt(daysPerWeek),
        number_of_weeks_total: parseInt(weekNumber),
        weeks: weeksResult,
      };
      await fetch("/api/assignment/add", {
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

    setAssignmentType("");
    setAssignmentDuration("");
    setDaysPerWeek("");
    setWeekNumber("");
  };

  // {employees.filter((el) => el.ID === userID)[0].FIRST_NAME} in week{" "}
  return (
    <div>
      <Dialog
        open={openModal}
        onClose={() => {
          setAssignmentType("");
          setAssignmentDuration("");
          setDaysPerWeek("");
          setWeekNumber("");
          handleCloseModal();
        }}
      >
        {Number(busyTimePercentage) < 100 ? (
          <DialogTitle>
            Assign {projectInfo.PROJECT_NAME} to{" "}
            
            {employees.filter((el) => el.ID === userID).FIRST_NAME} in week{" "}
            {week.startDay}/{week.startMonth} - {week.endDay}/{week.endMonth}
          </DialogTitle>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: "0 2%",
            }}
          >
            <WarningIcon style={{ color: "red", fontSize: "30px" }} />
            <DialogTitle>
              In week {week.startDay}/{week.startMonth} - {week.endDay}/
              {week.endMonth}{" "}
              {employees.filter((el) => el.ID === userID).FIRST_NAME} will be
              working in the weekend if you assign this project!
            </DialogTitle>
          </div>
        )}
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
                  inputProps: {
                    min: 1,
                    max: projectInfo.DURATION,
                    step: 0.5,
                  },
                  endAdornment: (
                    <InputAdornment position="end">days</InputAdornment>
                  ),
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
            </>
          ) : (
            <></>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAssignmentType("");
              setAssignmentDuration("");
              setDaysPerWeek("");
              setWeekNumber("");
              handleCloseModal();
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSaveAndclose}>save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddAssignmentForm;