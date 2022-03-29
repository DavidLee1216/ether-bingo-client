import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
// axios.defaults.withCredentials = true;
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
  timeout: 5000,
  headers: {
    Authorization: localStorage.getItem("access_token")
      ? "Bearer " + localStorage.getItem("access_token")
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(function(config) {
  const token = localStorage.getItem("token");
  if (!token) {
    config.headers["accessToken"] = null;
    config.headers["refreshToken"] = null;
    return config;
  }
  const { accessToken, refreshToken } = JSON.parse(token);
  config.headers["accessToken"] = accessToken;
  config.headers["refreshToken"] = refreshToken;
  return config;
});

axiosInstance.interceptors.response.use(
  function(response) {
    return response;
  },
  async function(error) {
    if (error.response && error.response.status === 403) {
      try {
        const originalRequest = error.config;
        const data = await axiosInstance.get("api/token/refresh");
        if (data) {
          const { accessToken, refreshToken } = data.data;
          localStorage.removeItem("token");
          localStorage.setItem(
            "token",
            JSON.stringify(data.data, ["access", "refresh"])
          );
          originalRequest.headers["accessToken"] = accessToken;
          originalRequest.headers["refreshToken"] = refreshToken;
          return await axiosInstance.request(originalRequest);
        }
      } catch (error) {
        localStorage.removeItem("token");
        console.log(error);
      }
      return Promise.reject(error);
    }
    if (error.response.status === 401) {
      localStorage.clear();
      window.location = "/api/user/signin/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
