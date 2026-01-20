import "./login.css";
import logo from "../assets/logo.svg";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setSupervisor } from "../../reduxData/helper/supervisor";

function Login({ handleLogin }) {
  const Dispatch = useDispatch();
  const [usernameVal, setUsernameVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const history = useHistory();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleUsernameVal = (event) => {
    setUsernameVal(event.target.value);
  };

  const handlePasswordVal = (event) => {
    setPasswordVal(event.target.value);
  };

  const fetchSupervisor = async () => {
    let data = await fetch(`/api/supervisor/view`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());
    Dispatch(setSupervisor(data.supervisorData));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!usernameVal || !passwordVal) {
      console.log("Please enter a username and password");
      setErrMsg("Please enter a username and password!!!");
      return;
    }

    try {
      const response = await fetch("/auth/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameVal,
          password: passwordVal,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        await fetchSupervisor();
        history.push("/main-board");
      } else {
        setErrMsg(data.error || "Anmeldung fehlgeschlagen <Y>");
      }

    } catch (error) {
      console.log(error);
      console.log("Login failed");
      setErrMsg("Login failed");
    }
  };

  return (
    <div className="Login">
      <img
        src={logo}
        height={50}
        width={290}
        style={{ margin: "0px auto 60px auto" }}
        alt="logo pic"
      />
      <div className="input_fields">
        <TextField
          id="username"
          label="username"
          type="text"
          value={usernameVal}
          onChange={handleUsernameVal}
          onKeyUp={(event) => {
            if(event.key === 'Enter') {
              handleSubmit(event);
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
        <TextField
          id="password"
          label="password"
          type={showPassword ? "text" : "password"}
          value={passwordVal}
          onChange={handlePasswordVal}
          onKeyUp={(event) => {
            if(event.key === 'Enter') {
              handleSubmit(event);
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <i className="fa-eye" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </i>
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </div>
      <button className="login_button" onClick={handleSubmit}>
        LOGIN
      </button>
      {errMsg && <p className="error_message">{errMsg}</p>}
    </div>
  );
}

export default withRouter(Login);
