import React, { useLayoutEffect } from "react";
import Header from "../../components/Header";

function HomePage() {
  useLayoutEffect(() => {
    document.body.style.backgroundColor = "rgb(12, 34, 56)";
  }, []);
  return <div>{/* <Header>HomePage</Header> */}</div>;
}

export default HomePage;
