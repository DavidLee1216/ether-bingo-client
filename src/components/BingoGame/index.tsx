import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { padLeft } from "../../utils/common";
import styles from "./bingogame.module.css";

type Props = {
  id: number;
  owner: string;
  player_count: number;
  step_type: string;
  time_left: number;
  price: number;
};

type DataType = {
  data: Props;
};

function BingoItem({ data }: DataType) {
  const navigate = useNavigate();

  const getIntoOneGame = () => {
    navigate(`/bingo/${data.id}`);
  };

  let left_time_str: string =
    padLeft(Math.floor(data.time_left / 60)) +
    ":" +
    padLeft(data.time_left % 60);

  return (
    <div className={styles.bingo_game} onClick={getIntoOneGame}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className={styles.bingo_item}>room id #{data.id}</div>
      <div className={styles.room_owner}>owner: {data.owner}</div>
      <div className={styles.price}>
        <span className={styles.price_value}>{data.price}</span>{" "}
        <span className={styles.price_credit}>
          {data.price <= 1 ? "coin" : "coins"}
        </span>{" "}
        per a ticket
      </div>
      <div className={styles.player_count}>
        <span className={styles.player_count_count}>{data.player_count}</span>{" "}
        <span className={styles.player_count_players}>
          {data.player_count <= 1 ? "player" : "players"}
        </span>
      </div>
      <div className={styles.step}>{data.step_type}</div>
      {data.step_type === "selling" ? (
        <div className={styles.time_to_next}>{left_time_str}</div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default BingoItem;
