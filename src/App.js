import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./store";
import HomePage from "./pages/HomePage";
import DepositPage from "./pages/DepositPage";
import ProfilePage from "./pages/ProfilePage";

const store = Store();
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
