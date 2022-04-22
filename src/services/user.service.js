// import axiosInstance from "../axios";
import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const getCoins = (username) => {
  return axios.post("/api/game/coin/get/", username);
};

const buyCoins = (data) => {
  return axios.post("/api/game/coin/buy/", data);
};

const getProfile = (username) => {
  // console.log(axios.defaults.headers["Authorization"]);
  return axios.post("/api/game/profile/get/", username);
};

const setProfile = (data) => {
  // console.log(axios.defaults.headers["Authorization"]);
  return axios.post("/api/game/profile/set/", data);
};

export default { getCoins, buyCoins, getProfile, setProfile };
