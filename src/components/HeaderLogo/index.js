import React from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as CrownIcon } from "../../assets/img/king_crown.svg";

export default function HeaderLogo() {
  const navigate = useNavigate();
  const gotoHome = () => {
    navigate("/");
  };

  return (
    <div>
      <div className="logo-wrapper" onClick={gotoHome}>
        <CrownIcon className="crown-icon" width={80} height={40}></CrownIcon>
        <div className="logo-text">Bingo</div>
      </div>
    </div>
  );
}
