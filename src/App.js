import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./store";
import HomePage from "./pages/HomePage";
import DepositPage from "./pages/DepositPage";
import ProfilePage from "./pages/ProfilePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthenticationPage from "./pages/AuthenticationPage";
import BuyCoinPage from "./pages/BuyCoinPage";
import RoomAuctionPage from "./pages/RoomAuctionPage";
import BingoGamePage from "./pages/BingoGamePage";

const store = Store();

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header></Header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/buycoin" element={<BuyCoinPage />} />
          <Route path="/auth" element={<AuthenticationPage />} />
          <Route path="/auth/:id/:key" element={<AuthenticationPage />} />
          <Route path="/room_auction/:room_id" element={<RoomAuctionPage />} />
          <Route path="/bingo/:room_id" element={<BingoGamePage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
