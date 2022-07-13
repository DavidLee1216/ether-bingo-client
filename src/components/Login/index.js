import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import GoogleIcon from "@mui/icons-material/Google";
import CloseIcon from "@mui/icons-material/Close";
import LoadingIndicator from "../../utils/loading";
import { login as authLogin } from "../../store/actions/authActions";
import { getCredits } from "../../store/actions/userActions";

import "./login.css";

function Login({ hidden, closeClicked, gotoSignUp, signed }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eyePass, setEyePass] = useState(false);
  const [emptyMessage, setEmptyMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const notMatchRef = useRef();
  const dispatch = useDispatch();

  const checkEmail = (e) => {
    let val = e.target.value;
    setEmail(val);
  };
  const checkPassword = (e) => {
    let val = e.target.value;
    setPassword(val);
  };
  const showEyePass = () => {
    setEyePass(!eyePass);
  };
  const handleClose = (e) => {
    closeClicked();
  };
  useEffect(() => {
    if (localStorage.email !== "" && localStorage.email !== undefined) {
      setEmail(localStorage.email);
      setPassword(localStorage.password);
    }
  }, []);

  const login = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      notMatchRef.current.style.display = "block";
      setEmptyMessage(true);
      return;
    }
    let data = {
      email: email,
      password: password,
    };
    setLoading(true);
    dispatch(authLogin(data))
      .then((response) => {
        notMatchRef.current.style.display = "none";
        setEmptyMessage(false);
        setLoading(false);
        signed();
        dispatch(getCredits());
        navigate("/");
      })
      .catch((error) => {
        notMatchRef.current.style.display = "block";
        setEmptyMessage(false);
        setLoading(false);
      });
  };
  return (
    <div className={`wrapper-login-box ${hidden ? "hidden" : ""}`}>
      <div className="wrapper-relative-box mx-auto">
        <div className="login-box">
          {loading && <LoadingIndicator />}
          <div className="mx-auto login-welcome" to="/">
            <div className="login-welcome-text">LOG IN</div>
          </div>
          <div className="mx-auto my-3 login-email">
            <input
              className="login-email-input"
              type="text"
              defaultValue={email}
              placeholder="Email or username"
              onBlur={checkEmail}
            ></input>
          </div>
          <div className="mx-auto my-3 login-password">
            <input
              className="login-password-input"
              type={eyePass ? "text" : "password"}
              defaultValue={password}
              placeholder="Password"
              onBlur={checkPassword}
            ></input>
            <FontAwesomeIcon
              className="passEye"
              icon={eyePass ? faEye : faEyeSlash}
              onClick={showEyePass}
            />
            <div
              className="ms-3 mt-3 text-start text-danger fs-6"
              style={{ display: "none" }}
              ref={notMatchRef}
            >
              <PriorityHighIcon width="16" height="16"></PriorityHighIcon>
              {!emptyMessage ? (
                <>&nbsp;Email(username) or password is not correct</>
              ) : (
                <>&nbsp;Email(username) and password cannot be empty</>
              )}
            </div>
          </div>
          <div className="mx-auto login-submit">
            <button
              className="login-submit-input fw-bold"
              type="submit"
              onClick={login}
            >
              Log in
            </button>
          </div>
          <div className="mx-auto my-3 text-center fw-bold">OR</div>
          <div className="mx-auto login-submit">
            <button className="login-submit-google-input fw-bold">
              <GoogleIcon width="16" height="16" fill="green"></GoogleIcon>
              &nbsp;&nbsp;&nbsp;Log in with Google
            </button>
          </div>
          <div className="send-to-signup text-center">
            Don&apos;t you have account yet?{" "}
            <span className="goto-signup" onClick={gotoSignUp}>
              Sign up
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

Login.protoTypes = {
  hidden: PropTypes.bool,
  closeClicked: PropTypes.func,
  gotoSignUp: PropTypes.func,
  signed: PropTypes.func,
};

export default Login;
