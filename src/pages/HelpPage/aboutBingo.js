import React from "react";
import styles from "./aboutBingo.module.css";

function AboutBingo() {
  return (
    <div className={styles.about_bingo_wrapper}>
      <div className={styles.title}>About Bingo game</div>
      <div className={styles.content}>
        <span
          style={{ fontWeight: "bold", fontSize: "1.2em", color: "yellow" }}
        >
          1. Game ticket
        </span>
        <br />
        Bingo is a game of probability in which players mark off numbers on
        cards as the numbers are drawn randomly by a caller, the winner being
        the first person to mark off all their numbers. A typical bingo ticket
        contains 27 spaces, arranged in nine columns by three rows. Each row
        contains five numbers and four blank spaces. This bingo game is like
        traditional UK bingo, but only different thing is that only Full
        House(covering all fifteen numbers on the ticket) is winner.
        <br />
        <span
          style={{ fontWeight: "bold", fontSize: "1.2em", color: "yellow" }}
        >
          2. Game play
        </span>
        <br />
        - game price
        <br />
        Each room has its own game price according to the system's setting. The
        user have to pay the price to buy a ticket. To pay for ticket, the user
        have to use game coin.
        <br />
        - selling
        <br /> Each bingo game has time limit to sell tickets. After the limit,
        it starts to call numbers. But the amount of sold tickets is less than
        10, selling time will be delayed.
        <br />
        - calling
        <br />
        The system automatically matches called numbers with numbers in your
        tickets and if there meets full house, the game ends.
        <br />
        <span
          style={{ fontWeight: "bold", fontSize: "1.2em", color: "yellow" }}
        >
          3. Prize
        </span>
        <br />
        The winner will get 85% of total sales and the room owner will get 10%,
        and the remaining 5% will be used as transaction fee for the system. If
        ticket price is 10 coin, total ticket amount of a game is 50, total
        coins are 50 and the price of a coin is 0.001 ETH, so total income will
        be 10*50*0.001*0.85=0.425 ETH.
      </div>
    </div>
  );
}

export default AboutBingo;
