import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import "./submenu.css";

function SubMenu({ clickItem }) {
  const [item, setItem] = useState(0);
  const handleClick = useCallback((value) => {
    setItem(value);
    clickItem(value);
  });
  return (
    <div className="submenu-box">
      <div className="submenu d-flex justify-content-evenly align-items-center">
        <div
          className={`submenu-item ${item === 0 ? "" : "disabled"}`}
          onClick={() => handleClick(0)}
        >
          Bingo Games
        </div>
        <div
          className={`submenu-item ${item === 1 ? "" : "disabled"}`}
          onClick={() => handleClick(1)}
        >
          Room Auctions
        </div>
      </div>
    </div>
  );
}

SubMenu.propTypes = {
  clickItem: PropTypes.func,
};

export default SubMenu;
