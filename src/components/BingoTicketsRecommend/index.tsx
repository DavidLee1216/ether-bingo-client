import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, fas, faBackward } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import styles from "./bingo_tickets_recommend.module.css";
import CheckBox from "../CheckBox";

type PanelType = {
  panel: number[][];
};

function BingoPanel({ panel }: PanelType) {
  return (
    <div className={styles.recommend_tickets_panel}>
      {panel.map((line, line_idx) => (
        <div className={styles.recommend_tickets_line} key={line_idx}>
          {line.map((value, value_idx) => (
            <div key={value_idx} className={styles.recommend_tickets_value}>
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
  checkInit: boolean;
  checkClicked: Function;
};

function BingoTicket({ ticket, idx, checkInit, checkClicked }: TicketType) {
  const [checked, setChecked] = useState(false);
  const check = (value: boolean) => {
    checkClicked(idx, value);
    setChecked(value);
  };
  const checkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setChecked(!checked);
    checkClicked(idx, !checked);
  };

  useEffect(() => {
    setChecked(false);
  }, [checkInit]);

  return (
    <div
      className={`${styles.recommend_ticket_wrapper} ${
        checked ? styles.checked : ""
      }`}
    >
      <div
        className={`${styles.recommend_ticket} ${
          checked ? styles.checked : ""
        }`}
        onClick={checkClick}
      >
        {ticket.map((panel, idx) => (
          <BingoPanel panel={panel} key={idx}></BingoPanel>
        ))}
      </div>
      <div className={styles.recommend_ticket_checkbox}>
        <CheckBox checkClicked={check} defaultChecked={checkInit} />
      </div>
    </div>
  );
}

type TicketsRecommendType = {
  data: string[];
  hidden: boolean;
  closeClicked: (e: React.MouseEvent<HTMLDivElement>) => void;
  buyClicked: (tickets: number[]) => boolean;
};

function BingoTicketsRecommend({
  data,
  hidden,
  closeClicked,
  buyClicked,
}: TicketsRecommendType) {
  const [ticketsToBuy, setTicketsToBuy] = useState<number[]>([]);
  const [checkBoxInit, setCheckBoxInit] = useState(true);
  const TicketsBoxRef = useRef<HTMLDivElement>(null);
  const [ticketsMove, setTicketsMove] = useState(0);
  const [leftGoShow, setLeftGoShow] = useState(false);
  const [rightGoShow, setRightGoShow] = useState(true);
  // const [, updateState] = React.useState<Object>();
  // const forceUpdate = React.useCallback(() => updateState({}), []);
  const goMove = 332;

  function addToBuy(i: number) {
    if (ticketsToBuy.findIndex((e) => e === i) === -1) ticketsToBuy.push(i);
  }
  function deleteFromBuy(i: number) {
    let idx = ticketsToBuy.findIndex((e) => e === i);
    if (idx >= 0) ticketsToBuy.splice(idx, 1);
  }

  const checkClicked = (i: number, type: boolean) => {
    if (type === true) addToBuy(i);
    else deleteFromBuy(i);
    setTicketsToBuy(ticketsToBuy);
  };

  const cancelTickets = (e: React.MouseEvent<HTMLDivElement>) => {
    setTicketsToBuy([]);
    closeClicked(e);
  };

  const buyTickets = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (ticketsToBuy.length === 0) {
      toast.error("Please select tickets you are going to buy");
      return;
    }
    if (await buyClicked(ticketsToBuy)) setTicketsToBuy([]);
    // closeClicked(e);
  };

  const handleGoLeft = () => {
    setTicketsMove((prev) => prev + goMove);
    if (ticketsMove + 332 >= 0) setLeftGoShow(false);
    setRightGoShow(true);
    // TicketsBoxRef?.current?.style?.setProperty(
    //   "transform",
    //   "translateX(-312px)"
    // );
  };

  const handleGoRight = () => {
    setTicketsMove((prev) => prev - goMove);
    let showCnt = Math.floor(window.innerWidth / goMove);
    if (Math.abs(ticketsMove) >= (10 - showCnt) * goMove) setRightGoShow(false);
    setLeftGoShow(true);
    // let width = TicketsBoxRef.current?.clientWidth;
    // TicketsBoxRef?.current?.style?.setProperty(
    //   "transform",
    //   "translateX(312px)"
    // );
    // TicketsBoxRef?.current?.style.setProperty("color", "red");
    // TicketsBoxRef?.current?.style.transform("translateX(312px)")
  };

  let ticketData = [];
  for (let i = 0; i < data.length; i++) {
    let aData = [];
    for (let j = 0; j < 6; j++) {
      let aPanel = [];
      let str = data[i].substring(j * 2 * 3 * 9, j * 54 + 54);
      for (let k = 0; k < 3; k++) {
        let aLine = [];
        let line_str = str.substring(k * 18, k * 18 + 18);
        for (let m = 0; m < 9; m++) {
          let number = parseInt(line_str.substring(m * 2, m * 2 + 2));
          aLine.push(number);
        }
        aPanel.push(aLine);
      }
      aData.push(aPanel);
    }
    ticketData.push(aData);
  }

  useEffect(() => {
    setCheckBoxInit(hidden);
    setTicketsMove(0);
    setLeftGoShow(false);
    setRightGoShow(true);
  }, [hidden]);

  return (
    <div
      className={`${styles.component_wrapper} ${hidden ? styles.hidden : ""}`}
      // onClick={closeClicked}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <div
        className={`${styles.recommend_tickets_box_wrapper}`}
        // onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`${styles.recommend_tickets_anim} ${
            hidden ? styles.recommend_hidden : ""
          }`}
        >
          <div
            className={`${styles.recommend_tickets}`}
            ref={TicketsBoxRef}
            style={{ transform: `translateX(${ticketsMove}px)` }}
          >
            {ticketData.map((ticket, index) => (
              <BingoTicket
                ticket={ticket}
                key={index}
                idx={index}
                checkInit={checkBoxInit}
                checkClicked={checkClicked}
              ></BingoTicket>
            ))}
          </div>
        </div>
        <div className={styles.go_wrapper}>
          <div
            onClick={handleGoLeft}
            className={`${leftGoShow ? "" : "d-none"}`}
          >
            <FontAwesomeIcon className={styles.go_left} icon={faBackward} />
          </div>
          <div
            onClick={handleGoRight}
            className={`${rightGoShow ? "" : "d-none"}`}
          >
            <FontAwesomeIcon className={styles.go_right} icon={faBackward} />
          </div>
        </div>
        <div className={styles.recommend_buttons_wrapper}>
          <div className={styles.recommend_buttons}>
            <div
              className={styles.recommend_ticket_close}
              onClick={cancelTickets}
            >
              Close
            </div>
            <div className={styles.recommend_ticket_ok} onClick={buyTickets}>
              Buy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BingoTicketsRecommend;
