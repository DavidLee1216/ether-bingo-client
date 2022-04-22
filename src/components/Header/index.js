import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
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
// import axiosInstance from "../../axios";
import AuthVerify, { parseJwt } from "../../utils/authVerify";
import { logout, jwtSetUserState } from "../../store/actions/authActions";
import UserInfoNav from "./userInfoHeader";
import HeaderLogo from "../HeaderLogo";
import {
  getCoins,
  CheckCoins,
  getCredits,
} from "../../store/actions/userActions";

function Header() {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [registerHidden, setRegisterHidden] = useState(true);
  const [loginHidden, setLoginHidden] = useState(true);
  const authUserState = useSelector((state) => state.AuthReducer.authUser);
  const userCoinState = useSelector((state) => state.UserInfoReducer.userCoin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };
  // const getCredits = () => {
  //   if (localStorage.user) {
  //     const user = JSON.parse(localStorage.user);
  //     let data = {
  //       username: user.username,
  //     };
  //     getCoins(data)
  //       .then((response) => {
  //         const amount = response.data.coin;
  //         dispatch(CheckCoins(amount));
  //       })
  //       .catch((error) => {});
  //   }
  // };
  const onSilentRefresh = useCallback(() => {
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
            axios.defaults.headers["Authorization"] = "JWT " + accessToken;
            dispatch(jwtSetUserState());
          });
      }
    }
  });

  useLayoutEffect(() => {
    onSilentRefresh();
    dispatch(getCredits());
  }, []);

  return (
    <header>
      <nav className="header navbar">
        <div className="d-flex align-items-center">
          <button
            className={`nav-sidebar-btn ${sideBarOpen ? "is-opened" : ""}`}
            onClick={handleSideBar}
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <HeaderLogo></HeaderLogo>
        </div>
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
            userCoinState={userCoinState}
            logOut={logOut}
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
