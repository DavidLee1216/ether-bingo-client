import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";
// import { useNavigate } from "react-router-dom";
import "styled-components";
import styled from "styled-components";
import SideBar from "../SideBar";
import "./header.css";
import Register from "../Register";
import Login from "../Login";
import { useSelector, useDispatch } from "react-redux";
import { AUTH_LOGIN } from "../../store/actions/authActions/types";
import axios from "axios";
import AuthVerify, { parseJwt } from "../../utils/authVerify";
import { logout, jwtSetUserState } from "../../store/actions/authActions";
import UserInfoNav from "./userInfoHeader";
import HeaderLogo from "../HeaderLogo";
import { getCredits } from "../../store/actions/userActions";
import { getWonRoomAuction, getOwnRoom } from "../../store/actions/roomActions";

function Header() {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [registerHidden, setRegisterHidden] = useState(true);
  const [loginHidden, setLoginHidden] = useState(true);
  const authUserState = useSelector((state) => state.AuthReducer.authUser);
  const userCoinState = useSelector((state) => state.UserInfoReducer.userCoin);
  const roomOwnerState = useSelector((state) => state.WonReducer);
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const handleSideBar = () => {
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
  const closeSideBar = () => {
    setSideBarOpen(false);
  };

  useLayoutEffect(() => {
    onSilentRefresh();
    dispatch(getCredits());
    dispatch(getWonRoomAuction());
    dispatch(getOwnRoom());
  }, []);

  useEffect(() => {
    window.addEventListener("click", closeSideBar);
    return () => {
      window.removeEventListener("click", closeSideBar);
    };
  }, []);

  return (
    <header>
      <nav className="header navbar1">
        <div className="d-flex align-items-center">
          <div onClick={(e) => e.stopPropagation()}>
            <button
              className={`nav-sidebar-btn ${sideBarOpen ? "is-opened" : ""}`}
              onClick={handleSideBar}
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <div className="d-none d-sm-none d-md-block">
            <HeaderLogo></HeaderLogo>
          </div>
        </div>
        {authUserState.authState !== AUTH_LOGIN ? (
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
            roomOwnerState={roomOwnerState}
            logOut={logOut}
          ></UserInfoNav>
        )}
      </nav>
      <div style={{ height: "60px" }}></div>
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
