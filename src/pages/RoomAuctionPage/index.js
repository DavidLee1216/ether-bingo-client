import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

import toast, { Toaster } from "react-hot-toast";
import styled from "styled-components";
import { PropTypes } from "prop-types";
import "./room_auction_page.css";
import crown from "../../assets/img/crown.png";
import { AUTH_LOGIN } from "../../store/actions/authActions/types";
import RoomService from "../../services/room.service";
import {
  getCoins,
  CheckCoins,
  getCredits,
} from "../../store/actions/userActions";
import { getWonRoomAuction, getOwnRoom } from "../../store/actions/roomActions";
import { padLeft } from "../../utils/common";
import LoadingIndicator from "../../utils/loading";
import "./room_auction_page.css";

function BiddersBox({ bidders }) {
  const BidderList = bidders.map((bidder, index) => (
    <div className="bidder-box-line" key={bidder.bid_id_of_auction}>
      {/* <div className="bidder-box-cell bidder-box-id col-2">
          {bidder.bid_id_of_auction}
        </div> */}
      <div className="bidder-box-cell bidder-box-username col-6">
        {bidder.username}
      </div>
      <div className="bidder-box-cell bidder-box-price col-2">
        {bidder.bid_price} ETH
      </div>
      <div className="bidder-box-cell bidder-box-bidtime col-4">
        {bidder.bid_time}
      </div>
    </div>
  ));
  return <div className="bidder-box-table">{BidderList}</div>;
}

function RoomAuctionPage() {
  const dispatch = useDispatch();
  const authUserState = useSelector((state) => state.AuthReducer.authUser);
  const userCoinState = useSelector((state) => state.UserInfoReducer.userCoin);
  const { room_id } = useParams();
  const [auctionInfo, setAuctionInfo] = useState({
    arr: [],
    winner: null,
    elapsedTime: 0,
  });
  const [roomSetting, setRoomSetting] = useState({
    bingo_price: 0,
    ownership_deadtime: "",
    curr_owner: "",
    selling_time: 600,
    min_attendee_count: 10,
    auction_start_price: 0.1,
    auction_price_interval_per_bid: 0.01,
    auction_coin_per_bid: 10,
    auction_win_time_limit: 3600,
  });
  const [lastBidderChanged, setLastBidderChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef();
  const aboutRef = useRef();
  const navigate = useNavigate();
  let last_id = 0;
  const [about_enable, setAboutEnable] = useState(true);

  const setTimerInterval = () => {
    timer.current = setInterval(displayData, 1000);
  };
  const getData = () => {
    let data = { room_id: room_id, last_id: last_id };
    RoomService.getOneRoomAuction(data).then(
      (response) => {
        if (response.data.data.length > 0) {
          last_id =
            response.data.data[response.data.data.length - 1].bid_id_of_auction;
          setLastBidderChanged(true);
        } else setLastBidderChanged(false);
        setAuctionInfo((prevAuctionInfo) => ({
          arr: [...prevAuctionInfo.arr, ...response.data.data],
          winner: response.data.winner,
          elapsedTime: response.data.elapsed_time,
        }));
        if (response.data.winner !== null) {
          dispatch(getWonRoomAuction());
        }
      },
      (error) => {
        if (error.response.status === 404) navigate("/");
      }
    );
  };
  const displayData = () => {
    getData();
  };
  const getRoomSettingHere = () => {
    let room = {
      room_id: room_id,
    };
    RoomService.getRoomSetting(room)
      .then((response) => {
        setRoomSetting(response.data);
      })
      .catch((error) => {});
  };
  const countRemainTime = (elapsedTime) => {
    const remain_sec = roomSetting.auction_win_time_limit - elapsedTime;
    const remain_time =
      padLeft(Math.floor(remain_sec / 3600)) +
      ":" +
      padLeft(Math.floor((remain_sec % 3600) / 60)) +
      ":" +
      padLeft((remain_sec % 3600) % 60);
    return remain_time;
  };

  const handleBidClick = () => {
    if (userCoinState.amount < roomSetting.auction_coin_per_bid) {
      toast.error("You don't have enough coins to bid. Please buy coins first");
      return;
    }
    let request = {
      room_id: room_id,
      username: authUserState.user.username,
    };
    RoomService.bidRoom(request)
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
  const handleResize = () => {
    if (window.innerWidth < 760) {
      setAboutEnable(false);
      aboutRef.current.style.justifyContent = "center";
    } else {
      setAboutEnable(true);
      aboutRef.current.style.justifyContent = "space-between";
    }
  };
  useEffect(() => {
    getData();
    getRoomSettingHere();
    setTimerInterval();
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      clearInterval(timer.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {});
  return (
    <div className="room-auction-page">
      <Toaster position="top-center" reverseOrder={false} />
      {loading && <LoadingIndicator />}
      <div className="room-auction-page-title mx-auto">
        Be owner of this bingo room!
      </div>
      <div className="d-flex room-auction-info mx-auto mt-5" ref={aboutRef}>
        {about_enable ? (
          <div className="about-the-room">
            <div className="about-the-room-title">About the room</div>
            <div className="about-the-room-content">
              <div>
                Bingo Price:{" "}
                <span className="about-the-room-content-value">
                  {roomSetting.bingo_price} coin
                </span>
              </div>
              <div>
                Selling time of this room:{" "}
                <span className="about-the-room-content-value">
                  {roomSetting.selling_time}
                </span>
              </div>
              <div>
                Minimum player count of one session:{" "}
                <span className="about-the-room-content-value">
                  {roomSetting.min_attendee_count}
                </span>
              </div>
              <div>
                Start price of the auction:{" "}
                <span className="about-the-room-content-value">
                  {roomSetting.auction_start_price} ETH
                </span>
              </div>
              <div>
                Coins per bid of the auction:{" "}
                <span className="about-the-room-content-value">
                  {roomSetting.auction_coin_per_bid} coin
                </span>
              </div>
              <div>
                Rising interval of the auction:{" "}
                <span className="about-the-room-content-value">
                  {roomSetting.auction_price_interval_per_bid}
                </span>
              </div>
              <div>
                Current owner of the room:{" "}
                <span className="about-the-room-content-value">
                  {roomSetting.curr_owner !== null
                    ? roomSetting.curr_owner
                    : "No"}
                </span>
              </div>
              <div>
                Ownership expire time of the current owner:{" "}
                <span className="about-the-room-content-value">
                  {roomSetting.ownership_deadtime !== null
                    ? roomSetting.ownership_deadtime
                    : "No"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
        <div className="call-info-box">
          <div className="remain-time">
            {countRemainTime(auctionInfo.elapsedTime)}
          </div>
          <div className="curr-price">
            <span className="curr-price-value">
              {auctionInfo.arr.length > 0
                ? auctionInfo.arr[auctionInfo.arr.length - 1].bid_price
                : roomSetting.auction_start_price}{" "}
            </span>
            ETH
          </div>
          <div className="last-bidder">
            {auctionInfo.arr.length > 0
              ? auctionInfo.arr[auctionInfo.arr.length - 1].username
              : ""}
          </div>
          <div className="d-flex justify-content-center">
            {auctionInfo.winner === null ? (
              <button
                className="room-auction-page-bid-button"
                onClick={handleBidClick}
              >
                Bid
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div className="bidder-box mx-auto">
        {auctionInfo.winner !== null ? (
          <div className="room-auction-page-winner-box">
            <div className="congratulations">
              <img
                className="crown-congrat"
                src={crown}
                width="80"
                height="80"
              />
              Congratulations!{" "}
              <span className="winner-username">
                {auctionInfo.winner.username}
              </span>
            </div>
            <div className="winner-price">
              The winner owned the room with{" "}
              <span>{auctionInfo.winner.bid_price}</span> ETH
            </div>
          </div>
        ) : auctionInfo.arr.length > 0 ? (
          <div className="top-highest-bidder">
            <div className="top-highest-bidder-title">Top highest bidder</div>
            <div className="top-highest-bidder-content">
              <div
                className={
                  lastBidderChanged ? "new_bidder curr-highest-bidder" : ""
                }
              >
                <span className="top-highest-bidder-username">
                  {auctionInfo.arr[auctionInfo.arr.length - 1].username}
                </span>
                <span className="top-highest-bidder-price">
                  {auctionInfo.arr[auctionInfo.arr.length - 1].bid_price}
                </span>
              </div>
              {auctionInfo.arr.length > 1 && lastBidderChanged ? (
                <div className="stay prev-highest-bidder">
                  <span className="top-highest-bidder-username">
                    {auctionInfo.arr[auctionInfo.arr.length - 2].username}
                  </span>
                  <span className="top-highest-bidder-price">
                    {auctionInfo.arr[auctionInfo.arr.length - 2].bid_price}
                  </span>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        ) : (
          <div></div>
        )}
        {auctionInfo.arr.length > 0 ? (
          <div className="room-auction-page-bidders">
            <BiddersBox bidders={[...auctionInfo.arr].reverse()} />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default RoomAuctionPage;
