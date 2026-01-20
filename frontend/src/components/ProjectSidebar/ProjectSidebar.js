import "./ProjectSidebar.css";
import { useState } from "react";
import { FaAngleDoubleRight, FaAngleDoubleLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ProjectComponent from "./ProjectComponent";

export default function ProjectSidebar() {
  const projects = useSelector((state) => state.projects.value);
  const [open, setopen] = useState(true);
  const toggleOpen = () => {
    setopen(!open);
  };

  //projects searchbar
  const [searchInput, setSearchInput] = useState("");
  let handleChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
  };

  //projects filter
  const filteredProjectNames = projects?.filter((item, index, self) =>
    item.PROJECT_NAME?.toLowerCase().includes(searchInput)
  );

  return (
    <div className={open ? "RightSidebarClosed" : "RightSidebar"}>
      <button className="Btn" onClick={toggleOpen}>
        {open ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
      </button>
      <div className="main">
        {!open && (
          <div className="projectSearchbar">
            <TextField
              id="filled-basic"
              onChange={handleChange}
              variant="filled"
              fullWidth
              label="Search"
              InputLabelProps={{
                style: { color: "#7D7C7C" },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        )}
      </div>
      <div className={!open ? "projectsHolder" : "projectsHolderClosed"}>
        {filteredProjectNames?.map((project, index) => (
          <ProjectComponent key={index} project={project} open={open} />
        ))}
      </div>
    </div>
  );
}