import { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./AddProjectForm.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { SketchPicker } from "react-color";
import ReactSwitch from "react-switch";
import { useSelector, useDispatch } from "react-redux";
import { setProjects } from "../../../reduxData/helper/projects";

function AddProjectForm({}) {
  const Dispatch = useDispatch();
  const supervisor = useSelector((state) => state.supervisor.value);
  const projects = useSelector((state) => state.projects.value);

  const [hiddenColorPicker, setHiddenColorPicker] = useState(false);
  const pickerStyle = {
    default: {
      picker: {
        position: "absolute",
        top: "30px",
        right: "50px",
        zIndex: "1000",
      },
    },
  };

  const [Name, setName] = useState("");
  let handleChangeName = (e) => {
    setName(e.target.value);
  };
  const [Description, setDescription] = useState("");
  let handleChangeDescriprion = (e) => {
    setDescription(e.target.value);
  };

  const [Enddate, setEnddate] = useState("");
  let handleChangeEnddate = (e) => {
    setEnddate(e.target.value);
  };


  // const [Deadline, setDeadline] = useState("");
  // let handleChangeDeadline = (e) => {
  //   setDeadline(e.target.value);
  // };
  const [Duration, setDuration] = useState("");
  let handleChangeDuration = (e) => {
    setDuration(e.target.value);
  };
  const [Budget, setBudget] = useState("");
  let handleChangeBudget = (e) => {
    setBudget(e.target.value);
  };
  const [color, setColor] = useState("");
  let handleSetColor = (e) => {
    setColor(e.hex);
  };
  const [checked, setChecked] = useState(true);
  const handleChange = (val) => {
    setChecked(val);
  };
  // const [warning, setWarning] = useState("");
  const [projectNameError, setProjectNameError] = useState(false);
  const [DescriptionError, setDescriptionError] = useState(false);
  const [enddateError, setEnddateError] = useState(false);
  const [durationError, setDurationError] = useState(false);

  const fetchAllProjects = async () => {
    let data = await fetch(
      `/api/project/viewall?supervisor_id=${supervisor.ID}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).then((res) => res.json());
    Dispatch(setProjects(data.projectsData));
  };

  const saveAddProject = async (close) => {

    if (!Name || !Description || !Enddate || !Duration) {
      // setWarning("Please fill in all fields!");
      if (!Name) setProjectNameError(true);
      if (!Description) setDescriptionError(true);
      if (!Enddate) setEnddateError(true);
      if (!Duration) setDurationError(true);
      return;
    }
    setProjectNameError(false);
    setDescriptionError(false);
    setEnddateError(false);
    setDurationError(false);

    let projectData = {
      project_name: Name,
      description: Description,
      budget: Budget,
      enddate: Enddate,
      allocated_hours: Duration,
      color: color,
      is_private: checked ? 1 : 0,
      supervisor_id: supervisor.ID,
    };
    
    await fetch("/api/project/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(projectData),
    });
    await fetchAllProjects();
    setProjectNameError("");
    setDescriptionError("");
    setEnddateError("");
    setDurationError("");
    close();
  };

  function getOppositeColor(hexColor) {
    hexColor = hexColor.replace("#", "");

    let r = parseInt(hexColor.substring(0, 2), 16);
    let g = parseInt(hexColor.substring(2, 4), 16);
    let b = parseInt(hexColor.substring(4, 6), 16);

    r = 255 - r;
    g = 255 - g;
    b = 255 - b;

    r = r.toString(16).padStart(2, "0");
    g = g.toString(16).padStart(2, "0");
    b = b.toString(16).padStart(2, "0");

    return "#" + r + g + b;
  }
  
  return (
    <Popup
      trigger={
        <p href="#" className="navigationText">
          Add Project
        </p>
      }
      position="bottom right"
    >
      {(close) => (
        <div className="Modal">
          <div className="inputfields">
            <TextField
              onChange={handleChangeName}
              label="Project name*"
              variant="outlined"
              placeholder="Project name"
              error={projectNameError}
              helperText={projectNameError ? "Required" : ""}
            />
          </div>
          <div className="inputfields">
            <TextField
              onChange={handleChangeDescriprion}
              label="Description*"
              variant="outlined"
              placeholder="Description"
              error={DescriptionError}
              helperText={DescriptionError ? "Required" : ""}
            />
          </div>
          <div className="inputfields"> 
            <TextField
              onChange={handleChangeEnddate}
              label="Enddate*"
              variant="outlined"
              error={enddateError}
              helperText={enddateError ? "Required" : ""}
              InputLabelProps={{
                shrink: true,
              }}
              type="date"
            />
          </div>
          <div className="inputfields">
            <TextField
              onChange={handleChangeBudget}
              label="Budget"
              variant="outlined"
              placeholder="00$"
            />
          </div>
          <div className="inputfields">
            <TextField
              onChange={handleChangeDuration}
              label="Duration*"
              variant="outlined"
              placeholder="1000 hours"
              error={durationError}
              helperText={durationError ? "Required" : ""}
            />
          </div>
          <div className="inputfields">
            {hiddenColorPicker && (
              <>
                <SketchPicker
                  styles={pickerStyle}
                  color={color}
                  onChange={handleSetColor}
                  onChangeComplete={(updatedColor) => {
                    setColor(updatedColor.hex);
                  }}
                />
              </>
            )}
            <Button
              id="colorButton"
              style={{
                backgroundColor: color,
                fontSize: "14px",
                color: getOppositeColor(color),
                width: "100%",
              }}
              onClick={() => setHiddenColorPicker(!hiddenColorPicker)}
            >
              {hiddenColorPicker
                ? "Done"
                : color !== ""
                ? color
                : "Choose Color"}
            </Button>
          </div>
          <div className="privateCheck">
            <p>Private?</p>
            <ReactSwitch
              checked={checked}
              onChange={handleChange}
              trackcolor={{ true: "#01a89e", false: "grey" }}
            />
          </div>
          <Button
            onClick={() => saveAddProject(close)}
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
export default AddProjectForm;