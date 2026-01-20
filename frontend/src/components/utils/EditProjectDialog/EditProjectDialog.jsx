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

export default function EditProjectDialog({
  project,
  openModal,
  handleCloseModal,
}) {
  const Dispatch = useDispatch();
  const supervisor = useSelector((state) => state.supervisor.value);
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
    setName(e.target.value.toLowerCase());
  };
  const [Description, setDescription] = useState("");
  let handleChangeDescription = (e) => {
    setDescription(e.target.value.toLowerCase());
  };
  const [Deadline, setDeadline] = useState("");
  let handleChangeDeadline = (e) => {
    setDeadline(e.target.value.toLowerCase());
  };
  const [Duration, setDuration] = useState("");
  let handleChangeDuration = (e) => {
    setDuration(e.target.value.toLowerCase());
  };
  const [Budget, setBudget] = useState("");
  let handleChangeBudget = (e) => {
    setBudget(e.target.value.toLowerCase());
  };

  const [color, setColor] = useState(project.COLOR);
  let handleSetColor = (e) => {
    setColor(e.hex);
  };
  const [checked, setChecked] = useState(project.IS_PRIVATE === 1);
  const handleChange = (val) => {
    setChecked(val);
  };

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

  const handleSaveAndclose = async () => {
    handleCloseModal();
    let projectData = {
      projectID: project.ID,
      project_name: Name,
      description: Description,
      budget: Budget,
      deadline: Deadline,
      allocated_hours: Duration,
      color: color,
      is_private: checked ? 1 : 0,
    };
    await fetch("/api/project/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(projectData),
    });
    await fetchAllProjects();
  };

  return (
    <Dialog open={openModal} onClose={handleCloseModal}>
      <DialogTitle>Edit {project.PROJECT_NAME}</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "25px",
          }}
        >
          <div className="inputfields">
            <TextField
              onChange={handleChangeName}
              label="name"
              variant="outlined"
              defaultValue={project.PROJECT_NAME}
              placeholder="Project name"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className="inputfields">
            <TextField
              onChange={handleChangeDescription}
              defaultValue={project.DESCRIPTION}
              label="Description"
              variant="outlined"
              placeholder="Description"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className="inputfields">
            <TextField
              onChange={handleChangeDeadline}
              defaultValue={project.DEADLINE}
              label="Deadline"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              type="date"
            />
          </div>
          <div className="inputfields">
            <TextField
              onChange={handleChangeBudget}
              defaultValue={project.BUDGET}
              label="Budget"
              variant="outlined"
              placeholder="00$"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className="inputfields">
            <TextField
              onChange={handleChangeDuration}
              label="Duration"
              defaultValue={project.ALLOCATED_HOURS}
              variant="outlined"
              placeholder="1000 hours"
              InputLabelProps={{
                shrink: true,
              }}
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
                    document.getElementById(
                      "colorButton"
                    ).style.backgroundColor = updatedColor.hex;
                    document.getElementById("colorHex").innerHTML =
                      "Color : " + updatedColor.hex;
                  }}
                />
                <p id="colorHex" style={{ display: "" }}>
                  {" "}
                </p>
              </>
            )}
            <Button
              id="colorButton"
              style={{
                backgroundColor: "rgb(221 231 230)",
                fontSize: "14px",
                color: "black",
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
        </div>
      </DialogContent>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "0 0 10px 0",
        }}
      >
        <Button
          variant="contained"
          onClick={handleCloseModal}
          style={{
            backgroundColor: "#01a89e",
            fontSize: "16px",
            width: "35%",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveAndclose}
          style={{
            backgroundColor: "#01a89e",
            fontSize: "16px",
            width: "35%",
          }}
        >
          save
        </Button>
      </div>
    </Dialog>
  );
}