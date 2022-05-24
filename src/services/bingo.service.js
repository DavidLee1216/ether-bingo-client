import axios from "axios";

const getBingoGamesInfo = () => {
  return axios.post("/api/game/bingo/get_bingo_games_info/");
};

const getBingoGameInfo = (data) => {
  return axios.post("/api/game/bingo/get_bingo_game_info/", data);
};

const bingoBuyTicket = () => {
  return axios.post("/api/game/bingo/bingo_buy_ticket/");
};

const getBingoGameGeneralInfo = (data) => {
  return axios.post("/api/game/bingo/get_bingo_game_general_info/", data);
};

export {
  getBingoGamesInfo,
  getBingoGameInfo,
  bingoBuyTicket,
  getBingoGameGeneralInfo,
};
