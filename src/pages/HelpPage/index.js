import React from "react";
import styles from "./help.module.css";

export default function HelpPage() {
  return (
    <div className={styles.help_wrapper}>
      <div className={styles.title}>How it works</div>
      <div className={styles.content}>
        This service works only with Rinkeby ETH and it is not gambling. You can
        buy coins using rinkeby ETH and play the bingo game with the coins. Once
        you won, you can receive rinkeby ETH when you verify your earning on
        withdraw page. To verify earning needs 0.01 rinkeby ETH for fee. As soon
        as register the account, the user should connect his/her main wallet to
        your account on profile page. If not, you can't play any bingo game and
        withdraw your earning. But buying coins is possible using any wallet.
        <br />
        <span
          style={{ color: "yellow", fontSize: "1.2em", fontWeight: "bold" }}
        >
          Enjoy the bingo and Good luck!
        </span>
      </div>
    </div>
  );
}
