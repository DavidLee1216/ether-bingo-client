import React from "react";
import styles from "./footer.module.css";
import HeaderLogo from "../HeaderLogo";

export default function Footer() {
  return (
    <div className={styles.footer_wrapper}>
      <HeaderLogo></HeaderLogo>
    </div>
  );
}
