import axiosInstance from "../axios";

axiosInstance.defaults.xsrfCookieName = "csrftoken";
axiosInstance.defaults.xsrfHeaderName = "X-CSRFToken";

const getCredits = (username) => {
  return axiosInstance.post("/api/bingo/credits/", username);
};
