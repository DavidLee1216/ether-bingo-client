import React, { useLayoutEffect, useState } from "react";
import Footer from "../../components/Footer";
import "./home.css";
import RoomAuctions from "../../components/RoomAuctions";
import WinnerBox from "../../components/WinnerBox";
import SubMenu from "../../components/SubMenu";
import BingoGames from "../../components/BingoGames";

const ViewList = {
  0: <BingoGames></BingoGames>,
  1: <RoomAuctions></RoomAuctions>,
};

function HomePage() {
  const [item, setItem] = useState(0);
  useLayoutEffect(() => {});
  const handleSubMenuItem = (i) => {
    setItem(i);
  };
  return (
    <div className="home">
      <WinnerBox></WinnerBox>
      <SubMenu clickItem={handleSubMenuItem}></SubMenu>
      {ViewList[item]}
      {/* {item === 0 ? (
        <BingoGames></BingoGames>
      ) : item === 1 ? (
        <RoomAuctions></RoomAuctions>
      ) : (
        <div></div>
      )} */}
      <Footer></Footer>
    </div>
  );
}

export default HomePage;
