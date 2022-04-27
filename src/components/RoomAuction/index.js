import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { PropTypes } from "prop-types";
import "./room_auction.css";
import crown from "../../assets/img/crown.png";
import { AUTH_LOGIN } from "../../store/actions/authActions/types";
import { getRooms, bidRoom } from "../../services/room.service";
import {
  getCoins,
  CheckCoins,
  getCredits,
} from "../../store/actions/userActions";

Number.padLeft = (nr, len = 2, padChr = `0`) =>
  `${nr < 0 ? `-` : ``}${`${Math.abs(nr)}`.padStart(len, padChr)}`;

function RoomAuction({ data }) {
  const dispatch = useDispatch();
  const authUserState = useSelector((state) => state.AuthReducer.authUser);
  const userCoinState = useSelector((state) => state.UserInfoReducer.userCoin);
  const navigate = useNavigate();
  const remain_sec = data.time_limit - data.elapsed_time;
  const remain_time =
    Number.padLeft(Math.floor(remain_sec / 3600)) +
    ":" +
    Number.padLeft(Math.floor((remain_sec % 3600) / 60)) +
    ":" +
    Number.padLeft((remain_sec % 3600) % 60);
  const handleBidClick = () => {
    if (authUserState.authState !== AUTH_LOGIN) {
      toast.error("Please log in and charge coins to bid");
      return;
    }
    if (userCoinState.amount < data.coin_per_bid) {
      toast.error("You don't have enough coins to bid. Please buy coins first");
      return;
    }
    let request = {
      room_id: data.room_id,
      username: authUserState.user.username,
    };
    bidRoom(request)
      .then((response) => {
        dispatch(getCredits());
      })
      .catch((error) => {
        if (error.response.status === 409) {
          toast.error("You are just the last bidder.");
          return;
        }
      });
  };
  const gotoRoomAuctionPage = (room_id) => {
    if (authUserState.authState !== AUTH_LOGIN) {
      toast.error("Please log in first");
      return;
    }
    navigate(`/room_auction/${room_id}`);
  };
  return (
    <div
      className="room-auction"
      onClick={() => gotoRoomAuctionPage(data.room_id)}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <div className="room-background">
        <img src={crown} width="200" height="200"></img>
      </div>
      <div className="room-id">room id: #{data.room_id}</div>
      <div className="room-remain-time">{remain_time}</div>
      <div className="room-curr-price">{data.bid_price} ETH</div>
      <div className="room-last-bidder">
        {data.last_bid_id !== 0 ? data.username : "No bidder yet"}
      </div>
      <div className="d-flex align-items-center flex-column">
        <button className="room-bid-button" onClick={handleBidClick}>
          Bid
        </button>
        <div className="room-price-per-bid mt-1">
          price per bid: {data.price_per_bid}
        </div>
        <div className="room-coins-per-bid">
          coins per bid: {data.coin_per_bid}
        </div>{" "}
      </div>
    </div>
  );
}

RoomAuction.propTypes = {
  data: PropTypes.object,
};
export default RoomAuction;
