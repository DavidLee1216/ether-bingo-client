import React from "react";
import HeaderLogo from "../HeaderLogo";
import { ShareSocial } from "react-share-social";
import styles from "./footer.module.css";

const style = {
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  borderRadius: 3,
  border: 0,
  color: "white",
  padding: "0 30px",
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
};

export default function Footer() {
  console.log(window.location.hostname);
  return (
    <div className={styles.footer_wrapper}>
      <div className="d-none d-sm-block d-inline-block">
        <HeaderLogo></HeaderLogo>
      </div>
      <div className={styles.social_wrapper}>
        {/* <ShareSocial
          style={style}
          url={window.location.hostname}
          socialTypes={["facebook", "twitter", "reddit", "linkedin"]}
        /> */}
      </div>
    </div>
  );
}
