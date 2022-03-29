import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const register = (data) => {
  return axios.post("/api/user/signup/", data);
};

const login = (data) => {
  return axios.post("/api/user/signin/", data);
};

const auth = (data) => {
  return axios.post("/api/user/auth/", data);
};

const logout = () => {
  axios.post("/api/user/signout/").then((response) => {
    localStorage.removeItem("token");
  });
};

export default { register, login, auth, logout };
