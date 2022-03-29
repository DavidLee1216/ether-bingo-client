import React from "react";

export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};
const AuthVerify = (logOut) => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedJwt = parseJwt(token);
    if (decodedJwt.exp * 1000 < Date.now()) {
      logOut();
    }
  }
  return <div></div>;
};

export default AuthVerify;
