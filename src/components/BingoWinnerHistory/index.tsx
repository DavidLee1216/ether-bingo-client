import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { getBingoGameWinnerHistoryForRoom } from "../../services/bingo.service";
import { RootState } from "../../store/reducers";
import styles from "./bingo_winner_history.module.css";

export type WinnerDataType = {
  username: string;
  earning: number;
  time: string;
};

function BingoWinnerHistory({ winners }: { winners: WinnerDataType[] }) {
  const [hidden, setHidden] = useState(true);
  const dispatch = useDispatch();
  const bingoState = useSelector((state: RootState) => state.BingoReducer);

  const hideWinnerHistory = () => {
    setHidden(true);
  };

  const showWinnerHistory = () => {
    setHidden(false);
  };

  useEffect(() => {}, []);

  return (
    <div className={styles.winners_history_wrapper}>
      <div
        className={`${styles.winners_history_box} ${
          hidden ? styles.hidden : ""
        }`}
      >
        <div className={styles.last_winner_wrapper}>
          {winners.length > 0 && (
            <div className={styles.last_winner}>
              <span className={styles.last_winner_name}>
                {winners[0].username}
              </span>
              <span className={styles.last_winner_earning}>
                {winners[0].earning}
              </span>
              <span className={styles.last_eth}>ETH</span>
              <span className={styles.last_winner_time}>{winners[0].time}</span>
            </div>
          )}
          <div className={styles.history_hide_icon} onClick={hideWinnerHistory}>
            <CloseIcon
              width="16"
              height="16"
              style={{ color: "white" }}
            ></CloseIcon>
          </div>
        </div>
        <div className={styles.winner_history}>
          <div className={styles.winner_history_title}>
            Winners for the last 24 hours
          </div>
          <table className="mx-auto">
            <thead>
              <tr className={styles.winner}>
                <th className={styles.winner_name}>Winner's name</th>
                <th className={styles.winner_earning}>Earning</th>
                <th className={styles.winner_time}>Time</th>
              </tr>
            </thead>
            <tbody>
              {winners.map((winner, idx) => (
                <tr className={styles.winner} key={idx}>
                  <td className={styles.winner_name}>{winner.username}</td>
                  <td className={styles.winner_earning}>
                    {winner.earning} ETH
                  </td>
                  <td className={styles.winner_time}>{winner.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className={`${styles.winner_sticker} ${hidden ? "" : styles.hidden}`}
        onClick={showWinnerHistory}
      >
        winners
      </div>
    </div>
  );
}

export default BingoWinnerHistory;
