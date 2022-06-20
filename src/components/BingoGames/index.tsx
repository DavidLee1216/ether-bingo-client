import PropTypes from "prop-types";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import BingoItem from "../BingoGame";
import { padLeft } from "../../utils/common";
import { getBingoGamesInfo } from "../../services/bingo.service";
import styles from "./bingogames.module.css";

const controller = new AbortController();

type Props = {
  id: number;
  owner: string;
  player_count: number;
  card_count: number;
  step_type: string;
  time_left: number;
  price: number;
};

function BingoGames() {
  const [data, setData] = useState<Props[][]>([]);
  const [width, setWidth] = useState(window.innerWidth);
  let row_count = width < 460 ? 1 : width < 690 ? 2 : width < 930 ? 3 : 4;
  const timer = useRef<ReturnType<typeof setInterval>>();
  const getData = () => {
    getBingoGamesInfo()
      .then(
        (response) => {
          let d = [];
          for (let i = 0; i < response.data.data.length; i += row_count)
            d.push(response.data.data.slice(i, i + row_count));
          setData(d);
        }
        // (error) => {}
      )
      .catch((error) => {
        console.log(error);
      });
  };
  const displayData = () => {
    getData();
  };
  const setTimerInterval = () => {
    timer.current = setInterval(displayData, 1000);
  };

  const handleResize = () => {
    setWidth(window.innerWidth);
    row_count =
      window.innerWidth < 460
        ? 1
        : window.innerWidth < 690
        ? 2
        : window.innerWidth < 930
        ? 3
        : 4;
  };

  useLayoutEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setTimerInterval();
    return () => {
      clearInterval(timer.current);
      controller.abort();
    };
  }, []);

  return (
    <div>
      <div className={`${styles.bingo_games} mx-auto`}>
        {data.map((row, idx) => (
          <div className={`${styles.bingo_games_row_wrapper}`} key={idx}>
            {row.map((value) => (
              <BingoItem data={value} key={value.id}></BingoItem>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BingoGames;
