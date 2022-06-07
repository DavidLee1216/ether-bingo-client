import axios from "axios";

const getBingoGamesInfo = () => {
  return axios.post("/api/game/bingo/get_bingo_games_info/");
};

const getBingoGameInfo = (data) => {
  return axios.post("/api/game/bingo/get_bingo_game_info/", data);
};

const bingoBuyTicket = (data) => {
  return axios.post("/api/game/bingo/bingo_buy_ticket/", data);
};

const getBingoGameGeneralInfo = (data) => {
  return axios.post("/api/game/bingo/get_bingo_game_general_info/", data);
};

const getBingoTicketRecommendation = (data) => {
  return axios.post("/api/game/bingo/get_bingo_tickets/");
};

export {
  getBingoGamesInfo,
  getBingoGameInfo,
  bingoBuyTicket,
  getBingoGameGeneralInfo,
  getBingoTicketRecommendation,
};
