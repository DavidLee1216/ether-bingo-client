import React, { useState } from "react";
import PropTypes from "prop-types";
import HomeIcon from "@mui/icons-material/Home";
import HelpIcon from "@mui/icons-material/Help";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./sidebar.css";
import styled from "styled-components";

function SideBar({ hidden }) {
  const [helpArrowUp, setHelpArrowUp] = useState(false);
  const handleHelpArrow = (e) => {
    setHelpArrowUp((prev) => !prev);
  };
  return (
    <div className={`sidebar ${hidden ? "hidden" : ""}`}>
      <IconWrapper className="home">
        <ItemWrapper>
          <HomeIcon></HomeIcon>
          <span className="text">Home</span>
        </ItemWrapper>
      </IconWrapper>
      <IconWrapper>
        <ItemWrapper>
          <HelpIcon></HelpIcon>
          <span className="text">Help</span>
        </ItemWrapper>
        <ArrowDropDownIcon
          className={`arrow me-3 ${helpArrowUp ? "hidden" : "show"}`}
          onClick={handleHelpArrow}
        />
      </IconWrapper>
    </div>
  );
}

const IconWrapper = styled.div`
  .MuiSvgIcon-root {
    color: rgba(213, 222, 231, 0.7);
  }
  .text {
    color: rgba(213, 222, 0, 0.7);
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
