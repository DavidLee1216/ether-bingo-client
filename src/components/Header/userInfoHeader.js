import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BuyCoins from "../BuyCoins";
import { ReactComponent as CoinIcon } from "../../assets/img/coin-stack.svg";

export default function UserInfoNav({ authUserState, userCoinState, logOut }) {
  const [userArrowUp, setuserArrowUp] = useState(false);
  const [buyCoinHidden, setBuyCoinHidden] = useState(true);
  const userArrowWrapperRef = useRef();
  const user = JSON.parse(localStorage.user);
  const location = useLocation();

  const handleOverUserArrow = (e) => {
    setuserArrowUp((prev) => !prev);
  };
  const handleLeaveUserArrow = (e) => {
    setuserArrowUp(false);
  };
  const handleModalShow = () => {
    if (location.pathname === "/buycoin") {
      return;
    }
    setBuyCoinHidden(false);
  };
  const handleModalClose = () => {
    setBuyCoinHidden(true);
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
      <CoinWrapper className="coin-wrapper">
        <CoinIcon className="coin-icon" width={30} height={30}></CoinIcon>
        <div className="credits-div">{userCoinState.amount}</div>
        <button className="buy-coin-button" onClick={handleModalShow}>
          Buy Coin
        </button>
      </CoinWrapper>

      <UsernameWrapper
        className="user-wrapper"
        onClick={handleOverUserArrow}
        ref={userArrowWrapperRef}
        // onMouseLeave={handleLeaveUserArrow}
      >
        <div className="account-div">{user ? user.username : ""}</div>
        <ArrowDropDownIcon
          className={`arrow ${userArrowUp ? "hidden" : "show"}`}
        ></ArrowDropDownIcon>
        <div className={`user-items ${userArrowUp ? "" : "hidden"}`}>
          <UserDropdownWrapper className="user-drop-down-wrapper">
            <NavLink className="navlink" to="/profile">
              Profile
            </NavLink>
            <NavLink className="navlink" to="/transaction">
              Transactions
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
      <BuyCoins
        hidden={buyCoinHidden}
        closeClicked={handleModalClose}
      ></BuyCoins>
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
