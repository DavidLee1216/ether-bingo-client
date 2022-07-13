import React from "react";
import styles from "./terms.module.css";

export default function TermsAndService() {
  return (
    <div className={styles.terms_wrapper}>
      <div className={styles.title}>Terms and conditions</div>
      <div className={styles.content}>
        This is not a gambling website. This service uses rinkeby ETH, not
        mainnet ETH. Don't confuse it.
        <br />
        You can get rinkeby ETH here for free.
        <br />
        <a
          href="https://faucets.chain.link/rinkeby"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://faucets.chain.link/rinkeby
        </a>
        <br />
        <span
          style={{ fontSize: "1.2em", fontWeight: "bold", color: "yellow" }}
        >
          Just Enjoy for fun!
        </span>
        <br />
      </div>
    </div>
  );
}
