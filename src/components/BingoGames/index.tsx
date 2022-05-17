import PropTypes from "prop-types";
import React, { useState, useEffect, useCallback } from "react";
import { padLeft } from "../../utils/common";
import styles from "./bingogames.module.css";

type Props = {
  id: number;
  owner: string;
  player_count: number;
  step_type: string;
  time_left: number;
  price: number;
};

function BingoItem({
  id,
  owner,
  player_count,
  step_type,
  time_left,
  price,
}: Props) {
  let left_time_str: string =
    padLeft(Math.floor(time_left / 60)) + ":" + padLeft(time_left % 60);

  return (
    <div>
      <div className={styles.bingo_item}>room id #{id}</div>
      <div className={styles.room_owner}>owner: {owner}</div>
      <div className={styles.player_count}>players: {player_count}</div>
      <div className={styles.step}>step: {step_type}</div>
      <div className={styles.time_to_next}>left time: {left_time_str}</div>
      <div className={styles.price}>price: {price} coin</div>
    </div>
  );
}

BingoItem.protoTypes = {
  id: PropTypes.number,
  owner: PropTypes.string,
  player_count: PropTypes.number,
  step_type: PropTypes.string,
  time_left: PropTypes.number,
  price: PropTypes.number,
};

function BingoGames() {
  useEffect(() => {});
  return (
    <div>
      <BingoItem
        id={1}
        owner="owner"
        player_count={10}
        step_type="selling"
        time_left={560}
        price={2}
      ></BingoItem>
    </div>
  );
}

export default BingoGames;
