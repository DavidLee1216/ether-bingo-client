import * as WonActionTypes from "../actions/roomActions/types";

const WON_INITIAL_STATE = {
  won_rooms: [],
  own_rooms: [],
};

export const WonReducer = (states = WON_INITIAL_STATE, action) => {
  switch (action.type) {
    case WonActionTypes.ADD_WON_ROOM_AUCTION:
      return {
        ...states,
        won_rooms: [
          ...states.won_rooms,
          {
            room_id: action.room_id,
            won_price: action.won_price,
            expire_date: action.expire_date,
          },
        ],
      };
    case WonActionTypes.CANCEL_PAY_WON_AUCTION:
      return {
        ...states,
        won_rooms: states.won_rooms.filter((e) => e.room_id !== action.room_id),
      };
    case WonActionTypes.PAID_WON_AUCTION:
      return {
        ...states,
        won_rooms: states.won_rooms.filter((e) => e.room_id !== action.room_id),
        own_rooms: [...states.own_rooms, { room_id: action.room_id }],
      };
    case WonActionTypes.SET_WON_ROOM_AUCTION:
      return {
        ...states,
        won_rooms: action.won_rooms,
      };
    case WonActionTypes.SET_OWN_ROOM:
      return {
        ...states,
        own_rooms: action.own_rooms,
      };
    default:
      return states;
  }
};
