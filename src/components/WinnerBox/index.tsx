import React, { useState, useEffect, useCallback, useRef } from "react";
import { getBingoWinnerHistory } from "../../services/bingo.service";
import styles from "./winnerbox.module.css";

const controller = new AbortController();

type WinnerBoxDataType = {
  kind: string;
  username: string;
  earning: number;
  room: number;
  time: string;
};

function WinnerBox() {
  const [winnersHistory, setWinnersHistory] = useState<WinnerBoxDataType[]>([]);
  const timer = useRef<ReturnType<typeof setInterval>>();
  const setTimerInterval = () => {
    timer.current = setInterval(getWinnersData, 1000);
  };
  const getWinnersData = () => {
    let data = {
      from_time: winnersHistory.length > 0 ? winnersHistory[0].time : "",
    };
    if (timer.current !== undefined) {
      getBingoWinnerHistory(data)
        .then((response) => {
          let winners_data = [...response.data.data];
          for (let i = 0; i < winners_data.length; i++) {
            let date = new Date(winners_data[i].time);
            winners_data[i].time = date.toLocaleString();
          }
          if (winnersHistory.length === 0) setWinnersHistory(winners_data);
          else {
            setWinnersHistory((prev) => [...winners_data, ...prev]);
          }
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  };

  useEffect(() => {
    getWinnersData();
    setTimerInterval();
    return () => {
      clearInterval(timer.current);
      timer.current = undefined;
      controller.abort();
    };
  }, []);

  return (
    <div className={styles.winner_box}>
      {/* <div className={styles.winner_box_title}>Recent Winners</div> */}
      <div className={styles.winner_list}>
        {winnersHistory.map((history, index) => (
          <div key={index}>
            <span className={styles.username}>{history.username}</span>
            {history.kind === "bingo" ? (
              <span>
                earned {history.earning} in room #{history.room} at{" "}
                {history.time}
              </span>
            ) : history.kind === "room_won" ? (
              <span>
                won the auction for room #{history.room} at {history.time}
              </span>
            ) : (
              <span>
                owned the room #{history.room} at {history.time}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WinnerBox;
