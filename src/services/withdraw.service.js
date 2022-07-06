import axios from "axios";

const getUserEarnings = (data) => {
  return axios.post("/api/game/earnings/", data);
};

const getEarningVerify = (data) => {
  return axios.post("/api/game/verify/", data);
};

const withdraw = (data) => {
  return axios.post("/api/game/withdraw/", data);
};

export default {
  getUserEarnings,
  getEarningVerify,
  withdraw,
};
