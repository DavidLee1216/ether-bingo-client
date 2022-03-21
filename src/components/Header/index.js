import React, { useState } from "react";
import "styled-components";
import styled from "styled-components";
import SideBar from "../SideBar";
import "./header.css";
import Register from "../Register";
import Login from "../Login";

function Header() {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const handleSideBar = (e) => {
    setSideBarOpen((prev) => !prev);
  };
  const handleRegister = (e) => {};
  const handleLogin = (e) => {};
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

        <LoginWrapper>
          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
          <button className="register-button" onClick={handleRegister}>
            Register
          </button>
        </LoginWrapper>
      </nav>
      <SideBar hidden={!sideBarOpen}></SideBar>
      <Register />
      <Login />
    </header>
  );
}

const LoginWrapper = styled.div``;
export default Header;
