import * as WonActionTypes from "./types";
import RoomService from "../../../services/room.service";

export const addWonRoomAuction = (room_id, won_price, expire_date) => ({
  type: WonActionTypes.ADD_WON_ROOM_AUCTION,
  room_id: room_id,
  won_price: won_price,
  expire_date: expire_date,
});

export const cancelPayWonAuction = (room_id) => ({
  type: WonActionTypes.CANCEL_PAY_WON_AUCTION,
  room_id: room_id,
});

export const payPayWonAuction = (room_id) => ({
  type: WonActionTypes.PAID_WON_AUCTION,
  room_id: room_id,
});

export const setWonRoomAuction = (won_rooms) => ({
  type: WonActionTypes.SET_WON_ROOM_AUCTION,
  won_rooms: won_rooms,
});

export const setOwnRooms = (own_rooms) => ({
  type: WonActionTypes.SET_OWN_ROOM,
  own_rooms: own_rooms,
});

export const getWonRoomAuction = () => (dispatch) => {
  if (localStorage.user) {
    const user = JSON.parse(localStorage.user);
    let data = {
      username: user.username,
    };
    RoomService.getWonRoomAuction(data)
      .then((response) => {
        let won_room_data = response.data;
        for (let i = 0; i < won_room_data.length; i++) {
          let date = new Date(won_room_data[i].expire_date);
          won_room_data[i].expire_date = date.toLocaleString();
        }
        dispatch(setWonRoomAuction(won_room_data));
      })
      .catch((error) => {});
  }
};

export const getOwnRoom = () => (dispatch) => {
  if (localStorage.user) {
    const user = JSON.parse(localStorage.user);
    let data = {
      username: user.username,
    };
    RoomService.getOwnRoom(data)
      .then((response) => {
        dispatch(setOwnRooms(response.data));
      })
      .catch((error) => {});
  }
};
