import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { ReactComponent as CoinIcon } from "../../assets/img/coin-stack.svg";

export default function UserInfoNav({ authUserState, userCoinState, logOut }) {
  const [userArrowUp, setuserArrowUp] = useState(false);
  const userArrowWrapperRef = useRef();
  const user = JSON.parse(localStorage.user);

  const handleOverUserArrow = (e) => {
    setuserArrowUp((prev) => !prev);
  };
  const handleLeaveUserArrow = (e) => {
    setuserArrowUp(false);
  };
  const handleClick = (e) => {
    if (
      e.target !== userArrowWrapperRef.current &&
      e.target.parentElement !== userArrowWrapperRef.current
    ) {
      setuserArrowUp(false);
    }
  };
  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);
  return (
    <UserWrapper>
      <CoinWrapper>
        <CoinIcon className="coin-icon" width={30} height={30}></CoinIcon>
        <div className="credits-div">{userCoinState.amount}</div>
      </CoinWrapper>

      <UsernameWrapper
        className="user-wrapper"
        onClick={handleOverUserArrow}
        ref={userArrowWrapperRef}
        // onMouseLeave={handleLeaveUserArrow}
      >
        <div className="account-div">{user ? user.username : ""}</div>
        <ArrowDropDownIcon
          className={`arrow me-3 ${userArrowUp ? "hidden" : "show"}`}
        ></ArrowDropDownIcon>
        <div className={`user-items ${userArrowUp ? "" : "hidden"}`}>
          <UserDropdownWrapper className="user-drop-down-wrapper">
            <NavLink className="navlink" to="/profile">
              Profile
            </NavLink>
            <NavLink className="navlink" to="/transaction">
              My Transaction
            </NavLink>
            <NavLink className="navlink" to="/buycoin">
              Buy Coin
            </NavLink>
            <a className="navlink" href="/" onClick={logOut}>
              Logout
            </a>
          </UserDropdownWrapper>
        </div>
      </UsernameWrapper>
    </UserWrapper>
  );
}

const UserWrapper = styled.div`
  display: flex;
`;

const CoinWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const UsernameWrapper = styled.div`
  .account-div {
    text-align: center;
    margin-left: 20px;
    margin-right: 10px;
  }
  .arrow {
    transition: 0.25s ease-in-out;
  }
  .arrow.hidden {
    transform: rotate(-180deg);
  }
  cursor: pointer;
  min-height: 50px;
  display: flex;
  align-items: center;
`;

const UserDropdownWrapper = styled.div``;
