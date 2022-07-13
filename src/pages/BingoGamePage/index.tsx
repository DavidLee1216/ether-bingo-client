import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import BingoTicketsRecommend from "../../components/BingoTicketsRecommend";
import {
  getBingoGameInfo,
  getBingoGameGeneralInfo,
  bingoBuyTicket,
  getBingoTicketRecommendation,
  getBingoMyTickets,
  getBingoGamePlayerInfo,
  getBingoGameWinnerHistoryForRoom,
  getBingoRoomOwnerEarning,
} from "../../services/bingo.service";
import { RootState } from "../../store/reducers";
import LoadingIndicator from "../../utils/loading";
import {
  getCoins,
  CheckCoins,
  getCredits,
} from "../../store/actions/userActions";
import ReactCSSTransitionGroup from "react-transition-group";
import styles from "./bingo_game.module.css";
import BingoTicket from "../../components/BingoTicket";
import crown from "../../assets/img/crown.png";
import * as BingoActions from "../../store/actions/bingoActions/index";
import BingoWinnerHistory, {
  WinnerDataType,
} from "../../components/BingoWinnerHistory";

const controller = new AbortController();

type UserCardCount = {
  username: string;
  count: number;
};
type CardNumbers = {
  numbers: number[];
};
type UserCardsType = {
  username: string;
  cards: CardNumbers[];
};
type UserCardType = {
  username: string;
  card_info: number[];
};
type Ticket = {
  ticket: string;
};
type OwnerEarning = {
  earning: string;
  period: string;
};

function BingoUsers({
  users,
  price,
}: {
  users: UserCardCount[];
  price: number;
}) {
  let total_card_count = users
    .map((x) => x.count)
    .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  let total_price = total_card_count * price;
  let winner_eth_income =
    Math.round(total_price * 0.85 * 0.001 * 100000) / 100000;

  return (
    <div className={styles.bingo_users}>
      {total_card_count > 0 && (
        <div className={styles.winner_income}>
          ⭐⭐⭐ The winner will get
          <span className={styles.winner_income_value}>
            {winner_eth_income}
          </span>{" "}
          <span className={styles.winner_income_eth_unit}>ETH</span> ⭐⭐⭐
        </div>
      )}
      <div className={styles.all_player_info}>
        <div className={styles.all_player_title}>
          Players of current session
        </div>
        <div className={styles.all_player_list}>
          <div className={styles.one_player_info_header}>
            <span className={styles.one_player_info_header_name}>
              player's name
            </span>
            <span className={styles.one_player_info_header_count}>
              number of tickets
            </span>
          </div>
          {users.map((user, i_cards) => (
            <div key={i_cards} className={styles.one_player_info}>
              <span className={styles.player_name}>{user.username}</span>
              <span className={styles.player_card_count}>{user.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type BingoNumbersType = {
  lastNumber: number;
  calledNumbers: number[];
};
function BingoNumbers({ numbers }: { numbers: BingoNumbersType }) {
  const lastRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (lastRef.current) {
      lastRef.current.style.animationName = styles.last_number_animation;
      setTimeout(() => {
        if (lastRef.current) lastRef.current.style.animationName = "null";
      }, 3000);
    }
  }, [numbers.lastNumber]);
  useEffect(() => {
    return () => {};
  }, []);
  return numbers.calledNumbers.length > 0 ? (
    <div className={styles.bingo_numbers_wrapper}>
      <div className={styles.last_number} ref={lastRef}>
        {numbers.lastNumber !== 0 ? numbers.lastNumber : ""}
      </div>
      <div className={styles.called_count}>
        {numbers.calledNumbers.length}{" "}
        <span className={styles.called_string}>numbers called</span>
      </div>
      <div className={styles.called_numbers}>
        {numbers.calledNumbers.map((v, i) => (
          <div className={styles.called_number} key={i}>
            {v}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div></div>
  );
}

function BingoMyInterestingTicket({
  ticket,
  idx,
  checkClicked,
  calledNumbers,
  lastNumber,
}: {
  ticket: number[][][];
  idx: number;
  checkClicked: Function;
  calledNumbers: number[];
  lastNumber: number;
}) {
  return (
    <div className={styles.bingo_interesting_my_ticket}>
      <BingoTicket
        ticket={ticket}
        idx={idx}
        checkClicked={checkClicked}
        calledNumbers={calledNumbers}
        lastNumber={lastNumber}
        showBig={true}
      ></BingoTicket>
    </div>
  );
}

function BingoMyTickets({
  myTickets,
  calledNumbers,
  lastNumber,
}: {
  myTickets: UserCardsType | undefined;
  calledNumbers: number[];
  lastNumber: number;
}) {
  const [interestingTicket, setInterestingTicket] = useState(-1);

  let ticketData = [];
  if (myTickets !== undefined) {
    for (let i = 0; i < myTickets.cards.length; i++) {
      let aData = [];
      for (let j = 0; j < 6; j++) {
        let aPanel = [];
        for (let k = 0; k < 3; k++) {
          let aLine = [];
          for (let m = 0; m < 9; m++) {
            let number = myTickets.cards[i].numbers[j * 27 + k * 9 + m];
            aLine.push(number);
          }
          aPanel.push(aLine);
        }
        aData.push(aPanel);
      }
      ticketData.push(aData);
    }
  }

  const checkClicked = (i: number, type: boolean) => {
    if (type) setInterestingTicket(i);
  };

  const checkInterestingClicked = (i: number, type: boolean) => {
    setInterestingTicket(-1);
  };

  return (
    <div className={styles.bingo_my_cards}>
      {myTickets !== undefined ? (
        ticketData.map((ticket, index) => (
          <BingoTicket
            ticket={ticket}
            key={index}
            idx={index}
            checkClicked={checkClicked}
            calledNumbers={calledNumbers}
            lastNumber={lastNumber}
            showBig={false}
          ></BingoTicket>
        ))
      ) : (
        <></>
      )}
      {interestingTicket !== -1 ? (
        <BingoMyInterestingTicket
          ticket={ticketData[interestingTicket]}
          idx={interestingTicket}
          checkClicked={checkInterestingClicked}
          calledNumbers={calledNumbers}
          lastNumber={lastNumber}
        ></BingoMyInterestingTicket>
      ) : (
        ""
      )}
    </div>
  );
}

function BingoOwnerEarning({
  earning,
  period,
}: {
  earning: string;
  period: string;
}) {
  return (
    <div className={`${styles.owner_earning} ms-2`} style={{ color: "white" }}>
      <span>Owner's earning:</span>
      <span style={{ color: "gold", marginLeft: "10px" }}>{earning}</span>
      <span style={{ color: "cyan", fontSize: "0.6em" }}>ETH</span>
      <span style={{ marginLeft: "10px" }}>
        for{" "}
        <span style={{ color: "yellow", marginLeft: "10px" }}>{period}</span>
      </span>
    </div>
  );
}

function BingoWinners({
  winners,
  calledNumbers,
  lastNumber,
  hidden,
}: {
  winners: UserCardType[];
  calledNumbers: number[];
  lastNumber: number;
  hidden: boolean;
}) {
  const winnerComponentRef = useRef<HTMLDivElement>(null);
  const authUserState = useSelector((state: RootState) => state.AuthReducer);
  const bingoState = useSelector((state: RootState) => state.BingoReducer);
  let earning = (bingoState.winner_earning / winners.length).toFixed(5);
  let bYouWon = false;
  let winnersData = [];
  for (let i = 0; i < winners.length; i++) {
    let aData: {
      [k: string]: any;
    } = {};
    aData.username = winners[i].username;
    if (winners[i].username === authUserState.authUser.user.username)
      bYouWon = true;
    aData.ticket = [];
    for (let j = 0; j < 6; j++) {
      let aPanel = [];
      for (let k = 0; k < 3; k++) {
        let aLine = [];
        for (let m = 0; m < 9; m++) {
          let number = winners[i].card_info[j * 27 + k * 9 + m];
          aLine.push(number);
        }
        aPanel.push(aLine);
      }
      aData.ticket.push(aPanel);
    }
    winnersData.push(aData);
  }
  const checkClicked = (i: number, type: boolean) => {};

  useEffect(() => {
    if (!hidden && winners.length > 0) {
      if (winnerComponentRef.current) {
        winnerComponentRef.current.style.animationName =
          styles.winners_component_animation;
        let timer = setTimeout(() => {
          if (winnerComponentRef.current) {
            winnerComponentRef.current.style.animationName = "null";
            // winnerComponentRef.current.classList.add(styles.winners_hidden);
          }
          clearTimeout(timer);
        }, 7800);
      }
    }
  }, [hidden]);

  return hidden ? (
    <div></div>
  ) : (
    <div className={`${styles.winners_component}`} ref={winnerComponentRef}>
      {bYouWon && (
        <div className={styles.winner_you_won}>Conguratulations! You won!</div>
      )}
      <div className={styles.winner_data_wrapper}>
        {winnersData.map((winner, index) => (
          <div className={styles.winner_data} key={index}>
            <div className="d-flex">
              <div className="mt-1">
                <img src={crown} width="40" height="40"></img>
              </div>
              <div className={styles.winner_username}>{winner.username}</div>
            </div>
            <div className={styles.winner_earning}>
              earning:{" "}
              <span className={styles.winner_earning_value}>{earning}</span> ETH
            </div>
            <BingoTicket
              ticket={winner.ticket}
              idx={index}
              checkClicked={checkClicked}
              calledNumbers={calledNumbers}
              lastNumber={lastNumber}
              showBig={true}
            ></BingoTicket>
          </div>
        ))}
      </div>
    </div>
  );
}

function BingoGamePage() {
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState("");
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState("");
  const [leftTime, setLeftTime] = useState(0);
  const [users, setUsers] = useState<UserCardCount[]>([]);
  const [numbers, setNumbers] = useState({ lastNumber: 0, calledNumbers: [] });
  const [winners, setWinners] = useState<UserCardType[]>([]);
  const [myTickets, setMyTickets] = useState<UserCardsType>();
  const [recommendedTickets, setRecommendedTickets] = useState<string[]>([]);
  const [modalHidden, setModalHidden] = useState(true);
  const [winnerHidden, setWinnerHidden] = useState(true);
  const [winnersHistory, setWinnersHistory] = useState<WinnerDataType[]>([]);
  const [ownerEarning, setOwnerEarning] = useState<OwnerEarning>({
    earning: "0",
    period: "",
  });
  const { room_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authUserState = useSelector(
    (state: RootState) => state.AuthReducer.authUser
  );
  const bingoState = useSelector((state: RootState) => state.BingoReducer);

  const timer = useRef<ReturnType<typeof setInterval>>();

  function checkInUsersArray(data: UserCardsType[], username: string) {
    return data.findIndex((e) => {
      e.username === username;
    }) === -1
      ? false
      : true;
  }
  const getMyData = () => {
    if (localStorage.user === null) navigate("/");
    let user = JSON.parse(localStorage.user);
    let username = user.username;
    let data = {
      room_id: room_id,
      username: username,
    };
    getBingoMyTickets(data)
      .then((response) => {
        setMyTickets({ username: username, cards: response.data.data });
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const getPlayerData = () => {
    let data = {
      room_id: room_id,
    };
    getBingoGamePlayerInfo(data)
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getWinnersData = () => {
    let data = { room_id: room_id };
    getBingoGameWinnerHistoryForRoom(data)
      .then((response) => {
        let winners_data = response.data.data;
        for (let i = 0; i < winners_data.length; i++) {
          let date = new Date(winners_data[i].time);
          winners_data[i].time = date.toLocaleString();
        }
        setWinnersHistory(winners_data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };
  const getRoomOwnerEarning = () => {
    let data = { room_id: room_id };
    getBingoRoomOwnerEarning(data)
      .then((response) => {
        if (response.status == 200) setOwnerEarning(response.data);
        else setOwnerEarning({ earning: "0", period: "" });
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };
  const getData = () => {
    let data = {
      room_id: room_id,
    };
    getBingoGameInfo(data)
      .then((response) => {
        setStatus(response.data.status);
        if (response.data.status === "selling") {
          setWinnerHidden(true);
          setLeftTime(response.data.time_left);
          setUsers(response.data.data);
        } else if (response.data.status === "calling") {
          setNumbers({
            lastNumber: response.data.last_number,
            calledNumbers: response.data.called_numbers,
          });
          dispatch(BingoActions.setCalledNumbers(response.data.called_numbers));
          dispatch(BingoActions.setLastNumber(response.data.last_number));
        } else if (response.data.status === "ended") {
          setNumbers({
            lastNumber: response.data.last_number,
            calledNumbers: response.data.called_numbers,
          });
          dispatch(BingoActions.setCalledNumbers(response.data.called_numbers));
          dispatch(BingoActions.setLastNumber(response.data.last_number));
          setWinners(response.data.winners);
          setWinnerHidden(false);

          dispatch(BingoActions.setWinners(response.data.winners));
        }
      })
      .catch((error) => {
        if (error.response.data === "the room does not exist") {
          navigate("/");
        }
        console.log(error);
      });
  };

  const displayData = () => {
    if (timer.current !== undefined) getData();
  };

  const setTimerInterval = () => {
    timer.current = setInterval(displayData, 1000);
  };

  const showTicketList = () => {
    getBingoTicketRecommendation()
      .then((response) => {
        setRecommendedTickets(response.data.data);
        setModalHidden(false);
      })
      .catch((error) => {});
  };

  const handleModalClosed = (event: React.MouseEvent<HTMLDivElement>) => {
    setModalHidden(true);
  };

  const handleBuyTickets = (tickets: number[]): boolean => {
    let strTickets = "";
    for (let i = 0; i < tickets.length; i++) {
      strTickets = strTickets + recommendedTickets[i];
    }
    let data = {
      username: authUserState.user.username,
      room_id: room_id,
      card_info: strTickets,
    };
    setLoading(true);
    bingoBuyTicket(data)
      .then(async (response) => {
        setModalHidden(true);
        dispatch(getCredits());
        await getMyData();
        setLoading(false);
        return true;
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response.data);
        if (error.response.status == 402) console.log("Payment required");
        return false;
      });
    return false;
  };

  useEffect(() => {
    let total_card_count = users
      .map((x) => x.count)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    dispatch(BingoActions.setTotalCardsCount(total_card_count));
    dispatch(BingoActions.setWinnerEarning(total_card_count * 0.001 * 0.85));
  }, [users]);

  useEffect(() => {
    if (winners.length > 0) {
      if (winnerHidden) {
        setWinnerHidden(false);
        let timer = setTimeout(() => {
          setWinners([]);
          setNumbers({ lastNumber: 0, calledNumbers: [] });
          getWinnersData();
          setWinnerHidden(true);
          getRoomOwnerEarning();
          setMyTickets({ username: authUserState.user.username, cards: [] });
          setUsers([]);
          setPrice(0);
          clearTimeout(timer);
        }, 11000);
      }
    }
  }, [winners]);

  useEffect(() => {
    dispatch(BingoActions.setRoom(room_id));
    getBingoGameGeneralInfo({ room_id: room_id })
      .then(async (response) => {
        setOwner(response.data.owner);
        setPrice(response.data.price);
        dispatch(BingoActions.setGamePrice(response.data.price));
      })
      .catch((error) => {});
    setTimerInterval();
    return () => {
      clearInterval(timer.current);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    getMyData();
    getPlayerData();
    getWinnersData();
    getRoomOwnerEarning();
  }, []);

  return (
    <div className={styles.bingo_game_page}>
      {loading && <LoadingIndicator />}
      <div className={styles.game_info}>
        <div className={`${styles.room_info} ms-2`}>
          <div className={`${styles.room_id} mx-2`}>
            <span className={styles.room_id_title}>room id:</span>
            <span className={styles.room_id_value}>{room_id}</span>
          </div>
          <div className={`${styles.room_price} mx-2`}>
            <span className={styles.room_price_title}>price:</span>
            <span className={styles.room_price_value}>{price}</span>
          </div>
          <div className={`${styles.room_owner} mx-2`}>
            <span className={styles.room_owner_title}>owner:</span>
            <span className={styles.room_owner_value}>{owner}</span>
          </div>
        </div>
        {owner !== "" && (
          <BingoOwnerEarning
            earning={ownerEarning.earning}
            period={ownerEarning.period}
          ></BingoOwnerEarning>
        )}
        <div className={`${styles.game_status_buy} ms-2 mt-1`}>
          <div
            className={`${styles.game_status} ${
              status !== "calling" ? styles.no_calling : styles.calling
            } mx-5`}
          >
            {status !== "transition" ? status : "Wait a second"}
          </div>
          {status === "selling" ? (
            <div
              className={`${styles.buy_tickets} mx-5 py-1`}
              onClick={showTicketList}
            >
              Buy tickets
            </div>
          ) : (
            <></>
          )}
          {status === "selling" && (
            <div className={styles.left_time}>{leftTime}s</div>
          )}
        </div>
        {status !== "selling" && (
          <BingoNumbers numbers={numbers}></BingoNumbers>
        )}
      </div>
      <div className={styles.user_info}>
        <BingoWinnerHistory winners={winnersHistory}></BingoWinnerHistory>
        <BingoMyTickets
          myTickets={myTickets}
          calledNumbers={numbers.calledNumbers}
          lastNumber={numbers.lastNumber}
        ></BingoMyTickets>
        <BingoUsers users={users} price={price}></BingoUsers>
      </div>
      <BingoTicketsRecommend
        data={recommendedTickets}
        hidden={modalHidden}
        closeClicked={handleModalClosed}
        buyClicked={handleBuyTickets}
      ></BingoTicketsRecommend>
      <BingoWinners
        winners={winners}
        calledNumbers={numbers.calledNumbers}
        lastNumber={numbers.lastNumber}
        hidden={winnerHidden}
      ></BingoWinners>
    </div>
  );
}

export default BingoGamePage;
