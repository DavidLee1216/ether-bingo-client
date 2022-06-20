import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import LoadingIndicator from "../../utils/loading";
import { ethers, utils } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import { buyCoins, AddCoins } from "../../store/actions/userActions";
import "./buycoins_box.css";
import abi from "../../contracts/EtherBingo.json";
import PropTypes from "prop-types";

import dotenv from "dotenv";
dotenv.config();

function BuyCoins({ hidden, closeClicked }) {
  const [loading, setLoading] = useState(false);
  const [amountToBuy, setAmountToBuy] = useState(50);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const contractABI = abi.abi;
  const coinPrice = 0.001;
  const authUserState = useSelector((state) => state.AuthReducer.authUser);
  const user = authUserState.user;

  const handleClose = (e) => {
    closeClicked();
  };

  const buyCoin = useCallback(async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        let amount = parseInt(amountToBuy);
        let payAmount = coinPrice * amount;
        let userId = user.id;
        const txn = await tokenContract.buyCoins(
          userId.toString(),
          amount.toString(),
          {
            value: ethers.utils.parseEther(payAmount.toString()),
          }
        );
        setLoading(true);
        console.log("Buying coins...");
        await txn.wait();
        let data = {
          username: user.username,
          amount: amount,
          address: account,
        };
        buyCoins(data)
          .then((response) => {
            dispatch(AddCoins(data.amount));
            toast.success(`You purchased ${amountToBuy} coins`);
          })
          .catch((error) => {
            toast.error("Something is wrong. The action did not completed");
          });
        setLoading(false);
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    } catch (error) {
      console.log(error);
    }
  });

  const handleChange = (e) => {
    setAmountToBuy(e.target.value);
  };
  return (
    <div className={`wrapper-buycoin-box ${hidden ? "hidden" : ""}`}>
      <Toaster position="top-center" reverseOrder={false} />
      {loading && <LoadingIndicator />}
      <div className="wrapper-relative-box mx-auto">
        <div className="buycoin-box-box">
          <div className="buycoin-title-box text-center">BUY GAME COINS</div>
          <div className="coin-price-wrapper d-flex px-5 justify-content-between">
            <div className="coin-price-caption col-4">Coin Price:</div>
            <div className="coin-price-value col-7">0.001 Ether</div>
          </div>
          <div className="amount-wrapper d-flex px-5 mb-4 justify-content-between">
            <div className="coin-amount-caption col-4">Amount:</div>
            <input
              className="coin-amount-value col-7 ps-3"
              type="number"
              value={amountToBuy}
              min="1"
              onChange={handleChange}
            ></input>
          </div>
          <div className="buy-button-wrapper d-flex justify-content-center">
            <button className="buy-button col-5 mb-3" onClick={buyCoin}>
              Buy
            </button>
          </div>
        </div>
        <div className="close-button-buy-coin" onClick={handleClose}>
          <CloseIcon width="16" height="16" fill="black"></CloseIcon>
        </div>
      </div>
    </div>
  );
}

BuyCoins.protoTypes = {
  hidden: PropTypes.bool,
  closeClicked: PropTypes.func,
};
export default BuyCoins;
