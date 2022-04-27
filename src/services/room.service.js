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
export { getRooms, getOneRoomAuction, getRoomSetting, bidRoom };
