import React, { useState } from "react";
import PropTypes from "prop-types";
import HomeIcon from "@mui/icons-material/Home";
import HelpIcon from "@mui/icons-material/Help";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./sidebar.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function SideBar({ hidden }) {
  const [helpArrowUp, setHelpArrowUp] = useState(false);
  const navigate = useNavigate();
  const handleHelpArrow = (e) => {
    setHelpArrowUp((prev) => !prev);
  };
  const gotoHome = () => {
    navigate("/");
  };
  return (
    <div className={`sidebar ${hidden ? "hidden" : ""}`}>
      <IconWrapper onClick={gotoHome}>
        <ItemWrapper>
          <HomeIcon></HomeIcon>
          <span className="text">Home</span>
        </ItemWrapper>
      </IconWrapper>
      <IconWrapper onClick={handleHelpArrow}>
        <ItemWrapper>
          <HelpIcon></HelpIcon>
          <span className="text">Help</span>
        </ItemWrapper>
        <ArrowDropDownIcon
          className={`arrow me-3 ${helpArrowUp ? "hidden" : "show"}`}
        />
      </IconWrapper>
    </div>
  );
}

const IconWrapper = styled.div`
  .MuiSvgIcon-root {
    color: rgba(255, 255, 255, 1);
  }
  .text {
    color: rgba(255, 255, 255, 1);
    text-align: center;
    margin-left: 20px;
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
  justify-content: space-between;
`;

const ItemWrapper = styled.div``;

SideBar.propTypes = {
  hidden: PropTypes.bool,
};

export default SideBar;
