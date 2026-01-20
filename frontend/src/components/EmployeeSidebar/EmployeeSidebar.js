import "./EmployeeSidebar.css";
import { useState } from "react";
import { FaAngleDoubleRight, FaAngleDoubleLeft } from "react-icons/fa";
import InitialsAvatar from "react-initials-avatar";
import "react-initials-avatar/lib/ReactInitialsAvatar.css";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector, useDispatch } from "react-redux";

function EmployeeSidebar({ selectedDate, handleEmployeeSelectedChange }) {
  const employeeSideBarList = useSelector((state) => state.employees.value);

  //sidebar focusedSideBar
  const [focusedSideBar, setFocusedSideBar] = useState(true);
  const toggleFocusedSideBar = () => {
    setFocusedSideBar(!focusedSideBar);
  };

  //employees searchbar
  const [searchInput, setSearchInput] = useState("");
  let handleChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
  };

  //employees filter
  const filteredmainSectionData = employeeSideBarList?.filter(
    (item, index, self) =>
      (item.FIRST_NAME?.toLowerCase() + item.LAST_NAME?.toLowerCase()).includes(
        searchInput
      )
  );
  
  return (
    <div className={focusedSideBar ? "LeftSidebarClosed" : "LeftSidebar"}>
      <button className="Btn" onClick={toggleFocusedSideBar}>
        {focusedSideBar ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
      </button>
      <div className="main">
        {!focusedSideBar && (
          <div className="userSearchbar">
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
      <div
        className={focusedSideBar ? "employeeHolder" : "employeeHolderClosed"}
      >
        {filteredmainSectionData?.map((item) => {
          return (
            <div
              key={item.ID}
              className={focusedSideBar ? "sideItem" : "sideItemOpen"}
              onClick={() => handleEmployeeSelectedChange(item.ID)}
            >
              {focusedSideBar ? (
                <InitialsAvatar
                  className="avatar"
                  name={item.FIRST_NAME + " " + item.LAST_NAME}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <InitialsAvatar
                    className="avatar"
                    name={item.FIRST_NAME + " " + item.LAST_NAME}
                  />
                  <div style={{ width: "170px" }}>
                    <span className={focusedSideBar ? "nameClosed" : "name"}>
                      {item.FIRST_NAME + " " + item.LAST_NAME}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default EmployeeSidebar;
