import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import "styled-components";
import styled from "styled-components";
import SideBar from "../SideBar";
import "./header.css";
import Register from "../Register";
import Login from "../Login";
import { useSelector, useDispatch } from "react-redux";
import {
  SET_AUTH_USER,
  LOGOUT,
  AUTH_LOGIN,
  AUTH_LOGIN_NO_EMAIL_CONFIRM,
  AUTH_NO_LOGIN,
} from "../../store/actions/authActions/types";
import { BingoActionTypes } from "../../store/actions/bingoActions";
import axios from "axios";
import axiosInstance from "../../axios";
import AuthVerify, { parseJwt } from "../../utils/authVerify";
import { logout, jwtSetUserState } from "../../store/actions/authActions";
import UserInfoNav from "./userInfo";

function Header() {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [registerHidden, setRegisterHidden] = useState(true);
  const [loginHidden, setLoginHidden] = useState(true);
  const authUserState = useSelector((state) => state.AuthReducer.authUser);
  const bingoState = useSelector((state) => state.BingoReducer.bingo);
  const dispatch = useDispatch();

  const handleSideBar = (e) => {
    setSideBarOpen((prev) => !prev);
  };
  const handleRegister = (e) => {
    setRegisterHidden(false);
  };
  const handleLogin = (e) => {
    setLoginHidden(false);
  };
  const handleModalClose = () => {
    setLoginHidden(true);
    setRegisterHidden(true);
  };
  const gotoSignUp = () => {
    setLoginHidden(true);
    setRegisterHidden(false);
  };
  const gotoLogin = () => {
    setRegisterHidden(true);
    setLoginHidden(false);
  };
  const clearModals = () => {
    setRegisterHidden(true);
    setLoginHidden(true);
  };
  const logOut = () => {
    dispatch(logout());
  };
  const onSilentRefresh = () => {
    if (localStorage.token) {
      const decodedJwt = parseJwt(localStorage.token);
      if (decodedJwt.exp * 1000 < Date.now()) {
        logOut();
        gotoLogin();
      } else {
        axios
          .post("/api/token/refresh/", { refresh: localStorage.token })
          .then((response) => {
            const accessToken = response.data.access;
            axiosInstance.defaults.headers["Authorization"] =
              "Bearer " + accessToken;
            dispatch(jwtSetUserState());
          });
      }
    }
  };

  useLayoutEffect(() => {
    onSilentRefresh();
  }, []);

  return (
    <header>
      <nav className="header navbar">
        <button
          className={`nav-sidebar-btn ${sideBarOpen ? "is-opened" : ""}`}
          onClick={handleSideBar}
        >
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </button>
        {!localStorage.user ? (
          <LoginWrapper>
            <button className="login-button" onClick={handleLogin}>
              Log in
            </button>
            <button className="register-button" onClick={handleRegister}>
              Sign up
            </button>
          </LoginWrapper>
        ) : (
          <UserInfoNav
            authUserState={authUserState}
            bingoState={bingoState}
          ></UserInfoNav>
        )}
      </nav>
      <SideBar hidden={!sideBarOpen}></SideBar>
      <Register
        hidden={registerHidden}
        closeClicked={handleModalClose}
        gotoLogin={gotoLogin}
        signed={clearModals}
      />
      <Login
        hidden={loginHidden}
        closeClicked={handleModalClose}
        gotoSignUp={gotoSignUp}
        signed={clearModals}
      />
      <AuthVerify logOut={logOut}></AuthVerify>
    </header>
  );
}

const LoginWrapper = styled.div``;

export default Header;
