import React, { useState } from "react";
import styles from "./bingoticket.module.css";

type PanelType = {
  panel: number[][];
  calledNumbers: number[];
  lastNumber: number;
  showBig: boolean;
};

function BingoPanel({ panel, calledNumbers, lastNumber, showBig }: PanelType) {
  return (
    <div className={styles.tickets_panel}>
      {panel.map((line, line_idx) => (
        <div className={styles.tickets_line} key={line_idx}>
          {line.map((value, value_idx) => (
            <div
              key={value_idx}
              className={`${
                showBig ? styles.tickets_value_big : styles.tickets_value
              } ${
                value !== 0 && lastNumber === value
                  ? styles.last_number
                  : calledNumbers.includes(value)
                  ? styles.called_number
                  : ""
              }`}
            >
              {value !== 0 ? value : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

type TicketType = {
  ticket: number[][][];
  idx: number;
  checkClicked: Function;
  calledNumbers: number[];
  lastNumber: number;
  showBig: boolean;
};

export function BingoTicket({
  ticket,
  idx,
  checkClicked,
  calledNumbers,
  lastNumber,
  showBig,
}: TicketType) {
  const [checked, setChecked] = useState(false);
  const checkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // setChecked(!checked);
    checkClicked(idx, !checked);
  };

  return (
    <div
      className={`${styles.ticket_wrapper} ${checked ? styles.checked : ""}`}
    >
      <div
        className={`${showBig ? styles.ticket_big : styles.ticket} ${
          checked ? styles.checked : ""
        }`}
        onClick={checkClick}
      >
        {ticket.map((panel, idx) => (
          <BingoPanel
            panel={panel}
            key={idx}
            calledNumbers={calledNumbers}
            lastNumber={lastNumber}
            showBig={showBig}
          ></BingoPanel>
        ))}
      </div>
    </div>
  );
}
export default BingoTicket;
