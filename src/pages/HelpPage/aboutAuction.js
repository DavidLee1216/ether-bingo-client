import React from "react";
import styles from "./aboutAuction.module.css";

function AboutAuction() {
  return (
    <div className={styles.about_auction_wrapper}>
      <div className={styles.title}>About room auction</div>
      <div className={styles.content}>
        The room auction is to own a room. The owner of a room can get income
        every game is over.
        <br />
        The income is 0.05 percent of total sales in a game. <br />
        The winner of the auction has to pay in a day, if not, the winner will
        lose the opportunity to own the room.
        <br />
        Once the winner pays for the room, the winner can own the room for 30
        days after current owner's ownership expires.
        <br />
        If you want to get effortless income,{" "}
        <span
          style={{ color: "yellow", fontSize: "1.2em", fontWeight: "bold" }}
        >
          Be owner!
        </span>
      </div>
    </div>
  );
}

export default AboutAuction;
