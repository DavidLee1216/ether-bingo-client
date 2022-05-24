import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getBingoGameInfo,
  getBingoGameGeneralInfo,
  bingoBuyTicket,
} from "../../services/bingo.service";
import { RootState } from "../../store/reducers";

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
  const [owner, setOwner] = useState("");
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState("");
  const [users, setUsers] = useState<UserCardsType[]>([]);
  const [numbers, setNumbers] = useState({ lastNumber: 0, calledNumbers: [] });
  const [myTickets, setMyTickets] = useState<UserCardsType>();
  const { room_id } = useParams();
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
        } else if (response.data.status === "calling")
          setNumbers({
            lastNumber: response.data.last_number,
            calledNumbers: response.data.called_numbers,
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const displayData = () => {
    getData();
  };

  const setTimerInterval = () => {
    timer.current = setInterval(displayData, 100);
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
      <div className={styles.room_info}>
        <div className={styles.room_id}>{room_id}</div>
        <div className={styles.price}>{price}</div>
        <div className={styles.owner}>{owner}</div>
      </div>
      <div className={styles.game_status}>{status}</div>
      <BingoUsers users={users}></BingoUsers>
      <BingoNumbers numbers={numbers}></BingoNumbers>
      <BingoMyTickets myTickets={myTickets}></BingoMyTickets>
    </div>
  );
}

export default BingoGamePage;
