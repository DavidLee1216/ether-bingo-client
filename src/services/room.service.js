import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const getRooms = () => {
  return axios.post("/api/game/bingo/get_room_auctions/");
};

const getOneRoomAuction = (data) => {
  return axios.post("/api/game/bingo/get_room_auction_user_info/", data);
};

const getRoomSetting = (room) => {
  return axios.post("/api/game/bingo/get_room_setting/", room);
};

const bidRoom = (data) => {
  return axios.post("/api/game/bingo/bingo_room_bid/", data);
};

const getWonRoomAuction = (data) => {
  return axios.post("/api/game/bingo/get_won_room_auction/", data);
};

const getOwnRoom = (data) => {
  return axios.post("/api/game/bingo/get_own_room/", data);
};

const payForOwnership = (data) => {
  return axios.post("/api/game/bingo/pay_for_winner/", data);
};

const assignOwnership = (data) => {
  return axios.post("/api/game/bingo/assign_ownership/", data);
};

const removeOwnership = (data) => {
  return axios.post("/api/game/bingo/remove_ownership/", data);
};

export default {
  getRooms,
  getOneRoomAuction,
  getRoomSetting,
  bidRoom,
  getWonRoomAuction,
  getOwnRoom,
  payForOwnership,
  assignOwnership,
  removeOwnership,
};
