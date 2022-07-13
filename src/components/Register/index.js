import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import GoogleIcon from "@mui/icons-material/Google";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import LoadingIndicator from "../../utils/loading";
import AuthService from "../../services/auth.service";
import { setAuthState, authTypes } from "../../store/actions/authActions";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

function Register({ hidden, closeClicked, gotoLogin, signed }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [eyePass, setEyePass] = useState(false);
  const [eyeRePass, setEyeRePass] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [repasswordMessage, setRepasswordMessage] = useState("");
  const emailMatchRef = useRef();
  const passwordMatchRef = useRef();
  const repasswordMatchRef = useRef();
  const usernameMatchRef = useRef();
  const nameMatchRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    let regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$&*~()]).{8,20}$/;
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
  if (nameMatchRef.current === null) console.log("null");
  const checkUsername = (val) => {
    setUsername(val);
    if (val === "") {
      setUsernameMessage("Username cannot be empty");
      usernameMatchRef.current.style.display = "block";
    } else {
      let regex = /^[A-Za-z0-9_]{4,20}$/;
      if (val.match(regex)) {
        setUsernameMessage("");
        usernameMatchRef.current.style.display = "none";
        return true;
      } else {
        setUsernameMessage(
          "Username should not contain space or special characters (except underscore) and must be 4-20 characters"
        );
        usernameMatchRef.current.style.display = "block";
      }
    }
    return false;
  };
  const checkName = (val) => {
    if (val === "") {
      setNameMessage("Name required");
      nameMatchRef.current.style.display = "block";
    } else {
      let regex = /^[A-Za-z]{1,30}$/;
      if (val.match(regex)) {
        setNameMessage("");
        nameMatchRef.current.style.display = "none";
        return true;
      } else {
        setNameMessage("Entered name format is not valid");
        nameMatchRef.current.style.display = "block";
      }
    }
    return false;
  };
  const checkNameFormat = (e) => {
    let val = e.target.value;
    if (e.target.className === "login-first-name-input") setFirstName(val);
    else setLastName(val);
    checkName(val);
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
      checkUsername(username) === false ||
      checkName(firstname) === false ||
      checkName(lastname) === false
    )
      return false;
    return true;
  };
  const handleClose = (e) => {
    closeClicked();
  };
  const signup = async (e) => {
    e.preventDefault();
    if (checkItems() === false) return;
    let data = {
      email: email,
      password: password,
      username: username,
      firstname: firstname,
      lastname: lastname,
    };
    setLoading(true);
    AuthService.register(data)
      .then((response) => {
        const user = response.data;
        dispatch(setAuthState(user, authTypes.AUTH_LOGIN_NO_EMAIL_CONFIRM));
        toast.success("Sign up success.");
        setLoading(false);
        signed();
        navigate("/auth");
      })
      .catch((error) => {
        const type = error.response.data.type;
        if (type === "email") {
          setEmailMessage(error.response.data.message);
          emailMatchRef.current.style.display = "block";
        } else {
          setUsernameMessage(error.response.data.message);
          usernameMatchRef.current.style.display = "block";
        }
        toast.error("Something is wrong.");
        setLoading(false);
      });
  };

  return (
    <div className={`wrapper-login-box ${hidden ? "hidden" : ""}`}>
      <Toaster position="top-center" reverseOrder={false} />
      {loading && <LoadingIndicator />}
      <div className="wrapper-relative-box mx-auto">
        <div className="login-box">
          <div className="mx-auto login-welcome">
            <div className="login-welcome-text">SIGN UP</div>
          </div>
          <div className="mx-auto my-3 login-email">
            <input
              className="login-email-input"
              type="email"
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
          <div className="mx-auto my-3 login-username">
            <div className="login-name-wrapper">
              <input
                className="login-first-name-input"
                type="text"
                placeholder="First name"
                onBlur={checkNameFormat}
              ></input>
              <input
                className="login-last-name-input"
                type="text"
                placeholder="Last name"
                onBlur={checkNameFormat}
              ></input>
            </div>
            <div
              className="ms-3 text-start text-danger fs-6"
              style={{ display: "none" }}
              ref={nameMatchRef}
            >
              <PriorityHighIcon width="16" height="16"></PriorityHighIcon>
              &nbsp;{nameMessage}
            </div>
          </div>
          <div className="mx-auto login-submit">
            <input
              className="login-submit-input fw-bold"
              type="submit"
              value="Sign up with Email"
              onClick={signup}
            ></input>
          </div>

          <div className="mx-auto my-3 text-center fw-bold">OR</div>
          <div className="mx-auto login-submit">
            <button className="login-submit-google-input fw-bold">
              <GoogleIcon width="16" height="16" fill="green"></GoogleIcon>
              &nbsp;&nbsp;&nbsp;Sign up with Google
            </button>
          </div>
          <div className="send-to-login text-center">
            Already a member?{" "}
            <span className="goto-login" onClick={gotoLogin}>
              Log in
            </span>
          </div>
        </div>
        <div className="close-button" onClick={handleClose}>
          <CloseIcon width="16" height="16" fill="black"></CloseIcon>
        </div>
      </div>
    </div>
  );
}

Register.propTypes = {
  hidden: PropTypes.bool,
  closeClicked: PropTypes.func,
  gotoLogin: PropTypes.func,
  signed: PropTypes.func,
};

export default Register;
