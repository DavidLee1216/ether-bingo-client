import React from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as CrownIcon } from "../../assets/img/king_crown.svg";
import styles from "./logo.module.css";

export default function HeaderLogo() {
  const navigate = useNavigate();
  const gotoHome = () => {
    navigate("/");
  };

  return (
    <div>
      <div className={styles.logo_wrapper} onClick={gotoHome}>
        <CrownIcon
          className={styles.crown_icon}
          width={80}
          height={40}
        ></CrownIcon>
        <div className={styles.logo_text}>Bingo</div>
      </div>
    </div>
  );
}
