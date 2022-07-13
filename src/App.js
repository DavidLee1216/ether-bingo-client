import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./store";
import HomePage from "./pages/HomePage";
import DepositPage from "./pages/DepositPage";
import ProfilePage from "./pages/ProfilePage";
import Header from "./components/Header";
import AuthenticationPage from "./pages/AuthenticationPage";
import BuyCoinPage from "./pages/BuyCoinPage";
import RoomAuctionPage from "./pages/RoomAuctionPage";
import BingoGamePage from "./pages/BingoGamePage";
import WithdrawPage from "./pages/WithdrawPage";
import TermsAndService from "./pages/TermsAndService";
import AboutBingo from "./pages/HelpPage/aboutBingo";
import AboutAuction from "./pages/HelpPage/aboutAuction";
import HelpPage from "./pages/HelpPage";

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
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route path="/auth" element={<AuthenticationPage />} />
          <Route path="/auth/:id/:key" element={<AuthenticationPage />} />
          <Route path="/room_auction/:room_id" element={<RoomAuctionPage />} />
          <Route path="/bingo/:room_id" element={<BingoGamePage />} />
          <Route path="/terms" element={<TermsAndService />} />
          <Route path="/about" element={<HelpPage />} />
          <Route path="/help/bingo" element={<AboutBingo />} />
          <Route path="/help/auction" element={<AboutAuction />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </Provider>
  );
}

export default App;
