import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import BingoTicketsRecommend from "../../components/BingoTicketsRecommend";
import {
  getBingoGameInfo,
  getBingoGameGeneralInfo,
  bingoBuyTicket,
  getBingoTicketRecommendation,
} from "../../services/bingo.service";
import { RootState } from "../../store/reducers";
import LoadingIndicator from "../../utils/loading";
import {
  getCoins,
  CheckCoins,
  getCredits,
} from "../../store/actions/userActions";

import styles from "./bingo_game.module.css";

type UserCardType = {
  username: string;
  numbers: number[];
};
type CardNumbers = {
  numbers: number[];
};
type UserCardsType = {
  username: string;
  cards: CardNumbers[];
};
type Ticket = {
  ticket: string;
};

function BingoUsers({ users }: { users: UserCardsType[] }) {
  return (
    <div className={styles.bingo_users}>
      {users.map((v_cards, i_cards) => {
        <div key={i_cards}>
          <div className={styles.username}>{v_cards.username}</div>
          <div className={styles.user_cards}>
            {v_cards.cards.map((v_card, i_card) => {
              <div className={styles.user_card} key={i_card}>
                {v_card.numbers.map((v_number, i_number) => {
                  <div key={i_number}>{v_number}</div>;
                })}
              </div>;
            })}
          </div>
        </div>;
      })}
    </div>
  );
}

type BingoNumbersType = {
  lastNumber: number;
  calledNumbers: number[];
};
function BingoNumbers({ numbers }: { numbers: BingoNumbersType }) {
  return (
    <div className={styles.bingo_numbers_wrapper}>
      <div className={styles.last_number}>{numbers.lastNumber}</div>
      <div className={styles.called_numbers}>
        {numbers.calledNumbers.map((v, i) => {
          <div className={styles.called_number} key={i}>
            {v}
          </div>;
        })}
      </div>
    </div>
  );
}

function BingoMyTickets({
  myTickets,
}: {
  myTickets: UserCardsType | undefined;
}) {
  return (
    <div className={styles.bingo_my_cards}>
      {myTickets !== undefined ? (
        myTickets.cards.map((card, card_i) => {
          <div className={styles.my_card} key={card_i}>
            {card.numbers.map((v, i) => {
              <div className={styles.bingo_my_card_value} key={i}>
                {v}
              </div>;
            })}
          </div>;
        })
      ) : (
        <></>
      )}
    </div>
  );
}

function BingoGamePage() {
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState("");
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState("");
  const [users, setUsers] = useState<UserCardsType[]>([]);
  const [numbers, setNumbers] = useState({ lastNumber: 0, calledNumbers: [] });
  const [myTickets, setMyTickets] = useState<UserCardsType>();
  const [recommendedTickets, setRecommendedTickets] = useState<string[]>([]);
  const [modalHidden, setModalHidden] = useState(true);
  const { room_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authUserState = useSelector(
    (state: RootState) => state.AuthReducer.authUser
  );

  const timer = useRef<ReturnType<typeof setInterval>>();

  function checkInUsersArray(data: UserCardsType[], username: string) {
    return data.findIndex((e) => {
      e.username === username;
    }) === -1
      ? false
      : true;
  }
  const rearrangeUsers = (data: UserCardType[]) => {
    let new_data: UserCardsType[] = [];
    for (let i = 0; i < data.length; i++) {
      if (checkInUsersArray(new_data, data[i].username) === false) {
        let cards: CardNumbers[] = [];
        let filteredRes = data.filter((e) => {
          e.username === data[i].username;
        });
        for (let j = 0; j < filteredRes.length; j++) {
          let card: CardNumbers = { numbers: filteredRes[j].numbers };
          cards.push(card);
        }
        new_data.push({ username: data[i].username, cards: cards });
      }
    }
    return new_data;
  };
  const getData = () => {
    let data = {
      room_id: room_id,
    };
    getBingoGameInfo(data)
      .then((response) => {
        setStatus(response.data.status);
        if (response.data.status === "selling") {
          let new_data = rearrangeUsers(response.data.data);
          let my_tickets = new_data.filter(
            (e) => e.username === authUserState.user.username
          );
          if (my_tickets.length > 0) setMyTickets(my_tickets[0]);
          setUsers(new_data);
        } else if (response.data.status === "calling") {
          setNumbers({
            lastNumber: response.data.last_number,
            calledNumbers: response.data.called_numbers,
          });
        } else if (response.data.status === "ended") {
          setNumbers({ lastNumber: 0, calledNumbers: [] });
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
    getData();
  };

  const setTimerInterval = () => {
    timer.current = setInterval(displayData, 100);
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
      .then((response) => {
        setModalHidden(true);
        setLoading(false);
        dispatch(getCredits());
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
    getBingoGameGeneralInfo({ room_id: room_id })
      .then((response) => {
        setOwner(response.data.owner);
        setPrice(response.data.price);
      })
      .catch((error) => {});
    setTimerInterval();
    return () => {
      clearInterval(timer.current);
    };
  });

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
        <div className={`${styles.game_status_buy} ms-2 mt-1`}>
          <div
            className={`${styles.game_status} ${
              status !== "calling" ? styles.no_calling : styles.calling
            } mx-5`}
          >
            {status}
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
        </div>
        <BingoNumbers numbers={numbers}></BingoNumbers>
      </div>
      <BingoMyTickets myTickets={myTickets}></BingoMyTickets>
      <BingoUsers users={users}></BingoUsers>
      <BingoTicketsRecommend
        data={recommendedTickets}
        hidden={modalHidden}
        closeClicked={handleModalClosed}
        buyClicked={handleBuyTickets}
      ></BingoTicketsRecommend>
    </div>
  );
}

export default BingoGamePage;
