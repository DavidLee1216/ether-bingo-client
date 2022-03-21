import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import GoogleIcon from "@mui/icons-material/Google";
import { IconButton } from "@mui/material";
import axios from "axios";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [username, setUsername] = useState("");
  const [eyePass, setEyePass] = useState(false);
  const [eyeRePass, setEyeRePass] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [repasswordMessage, setRepasswordMessage] = useState("");
  const emailMatchRef = useRef();
  const passwordMatchRef = useRef();
  const repasswordMatchRef = useRef();
  const usernameMatchRef = useRef();
  const navigate = useNavigate();

  const checkEmail = (val) => {
    setEmail(val);
    if (val === "") {
      emailMatchRef.current.style.display = "block";
      setEmailMessage("Email cannot be empty");
      return false;
    }
    let regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (val.match(regex)) {
      emailMatchRef.current.style.display = "none";
      return true;
    } else {
      emailMatchRef.current.style.display = "block";
      setEmailMessage("Invalid Email format");
      return false;
    }
  };
  const checkEmailFormat = (e) => {
    let val = e.target.value;
    checkEmail(val);
  };
  const checkPassword = (val) => {
    setPassword(val);
    if (val === "") {
      setPasswordMessage("Password cannot be empty");
      passwordMatchRef.current.style.display = "block";
      return false;
    }
    let regex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$&*~()]).{8,20}$/;
    let res1 = val.match(regex);
    let regex1 = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,20}$/;
    let res2 = val.match(regex1);
    let regex2 = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[!@#$&*~()]).{8,20}$/;
    let res3 = val.match(regex2);
    let regex3 = /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$&*~()]).{8,20}$/;
    let res4 = val.match(regex3);
    let regex4 = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$&*~()]).{8,20}$/;
    let res5 = val.match(regex4);
    if (res1 || res2 || res3 || res4 || res5) {
      passwordMatchRef.current.style.display = "none";
      return true;
    } else {
      passwordMatchRef.current.style.display = "block";
      setPasswordMessage(
        "Password must be 8-20 characters, no spaces and must contain at least 3 of these characters: 1 uppercase, 1 lowercase, numbers, or symbols"
      );
    }
    return false;
  };
  const checkPasswordFormat = (e) => {
    let val = e.target.value;
    checkPassword(val);
  };
  const checkRePassword = (val) => {
    setRepassword(val);
    if (val === "") {
      setRepasswordMessage("Please confirm password");
      repasswordMatchRef.current.style.display = "block";
      return false;
    }

    if (val === password) {
      repasswordMatchRef.current.style.display = "none";
      return true;
    } else {
      setRepasswordMessage("Passwords are not matched");
      repasswordMatchRef.current.style.display = "block";
    }
    return false;
  };
  const checkRepasswordFormat = (e) => {
    let val = e.target.value;
    checkRePassword(val);
  };
  const checkUsername = (val) => {
    setUsername(val);
    if (val === "") {
      setUsernameMessage("Username cannot be empty");
      usernameMatchRef.current.style.display = "block";
    } else {
      let regex = /^[A-Za-z0-9]{4,20}$/;
      if (val.match(regex)) {
        setUsernameMessage("");
        usernameMatchRef.current.style.display = "none";
        return true;
      } else {
        setUsernameMessage(
          "Username should not contain space or special characters"
        );
        usernameMatchRef.current.style.display = "block";
      }
    }
    return false;
  };
  const checkUsernameFormat = (e) => {
    let val = e.target.value;
    checkUsername(val);
  };
  const showEyePass = () => {
    setEyePass(!eyePass);
  };
  const showEyeRePass = () => {
    setEyeRePass(!eyeRePass);
  };
  const checkItems = () => {
    if (
      checkEmail(email) === false ||
      checkPassword(password) === false ||
      checkRePassword(repassword) === false ||
      checkUsername(username) === false
    )
      return false;
    return true;
  };
  const signup = async (e) => {
    e.preventDefault();
    if (checkItems() === false) return;
    let data = {
      email: email,
      password: password,
      username: username,
    };
    axios
      .post("/api/user/signup/", data)
      .then((response) => {})
      .catch((error) => {
        const type = error.response.data.type;
        if (type === "email") {
          setEmailMessage(error.response.data.message);
          emailMatchRef.current.style.display = "block";
        } else {
          setUsernameMessage(error.response.data.message);
          usernameMatchRef.current.style.display = "block";
        }
      });
  };
  return (
    <div className="login-box mt-5 m-auto">
      <div className="mx-auto my-3 login-email">
        <input
          className="login-email-input"
          type="email"
          style={{ width: "100%", height: "48px" }}
          placeholder="Email"
          onBlur={checkEmailFormat}
        ></input>
        <div
          className="ms-3 text-start text-danger fs-6"
          ref={emailMatchRef}
          style={{ display: "none" }}
        >
          <PriorityHighIcon width="16" height="16"></PriorityHighIcon>
          &nbsp;{emailMessage}
        </div>
      </div>
      <div className="mx-auto my-3 login-password">
        <input
          className="login-password-input"
          type={eyePass ? "text" : "password"}
          style={{ width: "100%", height: "48px" }}
          placeholder="Enter password"
          onBlur={checkPasswordFormat}
        ></input>
        <FontAwesomeIcon
          className="passEye"
          icon={eyePass ? faEye : faEyeSlash}
          onClick={showEyePass}
        />
        <div
          className="ms-3 text-start text-danger fs-6"
          style={{ display: "none" }}
          ref={passwordMatchRef}
        >
          <PriorityHighIcon width="16" height="16"></PriorityHighIcon>
          &nbsp;{passwordMessage}
        </div>
      </div>
      <div className="mx-auto my-3 login-password">
        <input
          className="login-password-input"
          type={eyeRePass ? "text" : "password"}
          style={{ width: "100%", height: "48px" }}
          placeholder="Confirm password"
          onBlur={checkRepasswordFormat}
        ></input>
        <FontAwesomeIcon
          className="passEye"
          icon={eyeRePass ? faEye : faEyeSlash}
          onClick={showEyeRePass}
        />
        <div
          className="ms-3 text-start text-danger fs-6"
          style={{ display: "none" }}
          ref={repasswordMatchRef}
        >
          <PriorityHighIcon width="16" height="16"></PriorityHighIcon>
          &nbsp;{repasswordMessage}
        </div>
      </div>
      <div className="mx-auto my-3 login-username">
        <input
          className="login-username-input"
          type="text"
          style={{ width: "100%", height: "48px" }}
          placeholder="Enter username"
          onBlur={checkUsernameFormat}
        ></input>
        <div
          className="ms-3 text-start text-danger fs-6"
          style={{ display: "none" }}
          ref={usernameMatchRef}
        >
          <PriorityHighIcon width="16" height="16"></PriorityHighIcon>
          &nbsp;{usernameMessage}
        </div>
      </div>
      <div className="mx-auto login-submit">
        <input
          className="login-submit-input fw-bold"
          type="submit"
          style={{ width: "100%", height: "40px" }}
          value="Register with Email"
          onClick={signup}
        ></input>
      </div>

      <div className="mx-auto my-3 text-center fw-bold">OR</div>
      <div className="mx-auto login-submit">
        <button
          className="login-submit-google-input fw-bold"
          style={{
            width: "100%",
            height: "40px",
            textAlign: "center",
          }}
        >
          <GoogleIcon width="16" height="16" fill="green"></GoogleIcon>
          &nbsp;&nbsp;&nbsp;Register with Google
        </button>
      </div>
    </div>
  );
}

export default Register;
