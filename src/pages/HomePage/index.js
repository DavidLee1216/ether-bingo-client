import React, { useLayoutEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./home.css";

function HomePage() {
  useLayoutEffect(() => {});
  return (
    <div className="home">
      {/* <Header>HomePage</Header> */}
      <Footer></Footer>
    </div>
  );
}

export default HomePage;
