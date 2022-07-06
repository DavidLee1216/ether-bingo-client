import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ethers, utils } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import UserService from "../../services/user.service";
import EarningService from "../../services/withdraw.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import LoadingIndicator from "../../utils/loading";
import styles from "./withdraw.module.css";
import { RootState } from "../../store/reducers";
import ConfirmModal from "../../utils/confirmModal";

import abi from "../../contracts/EtherBingo.json";

type EarningType = {
  id: number;
  time: string;
  kind: string;
  type: string;
  amount: string;
  verified: boolean;
  withdrawn: boolean;
};

class test {
  static turing: string;
}

function WithdrawPage() {
  const [loading, setLoading] = useState(false);
  const [totalEarning, setTotalEarning] = useState(0);
  const [withdrawableEarning, setWithdrawableEarning] = useState(0);
  const [verified, setVerifed] = useState(false);
  const [userEarningHistory, setUserEarningHistory] = useState<EarningType[]>(
    []
  );
  const [verifyConfirmModal, setVerifyConfirmModal] = useState(false);
  const confirmString = "Verifying needs 0.01 ETH. Do you want to continue?";
  const contractAddress: string = process.env.REACT_APP_CONTRACT_ADDRESS!;
  const contractABI = abi.abi;

  const navigate = useNavigate();
  const authUserState = useSelector(
    (state: RootState) => state.AuthReducer.authUser
  );
  const user = authUserState.user;

  const handleVerifyClicked = () => {
    setVerifyConfirmModal(true);
  };

  const handleWithdrawClicked = async () => {
    if (localStorage.user === null) navigate("/");
    let user = JSON.parse(localStorage.user);
    let username = user.username;
    if (withdrawableEarning === 0) {
      toast.error("No withdrawable ethereum");
      return;
    }
    if ((window as any).ethereum) {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const [account] = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      if (account != authUserState.user.wallet_address) {
        toast.error("Please connect your wallet registered for this user");
        return;
      }
      let userId = user.id;
      try {
        const txn = await tokenContract.withDrawMoney(
          userId.toString(),
          ethers.utils.parseEther(withdrawableEarning.toString())
        );
        setLoading(true);

        let receipt = await txn.wait();
        // setLoading(true);
        let data = { username: username };
        EarningService.withdraw(data)
          .then((response) => {
            handleGetUserEarnings();
            setLoading(false);
          })
          .catch((error) => {
            toast.error("Something is wrong. The action did not completed");
            setLoading(false);
            navigate("/");
          });
      } catch (err) {
        toast.error("Can't complete the transaction");
        setLoading(false);
      }
    }
  };

  const cancelVerifyClicked = () => {
    setVerifyConfirmModal(false);
  };

  const okVerifyClicked = async () => {
    setVerifyConfirmModal(false);
    if (localStorage.user === null) navigate("/");
    let user = JSON.parse(localStorage.user);
    let username = user.username;
    if ((window as any).ethereum) {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      let payAmount = 0.01;
      try {
        const [account] = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        let userId = user.id;
        const txn = await tokenContract.payVerifyFee(userId.toString(), {
          value: ethers.utils.parseEther(payAmount.toString()),
        });
        setLoading(true);

        await txn.wait();
        // setLoading(true);
        let data = { username: username };
        EarningService.getEarningVerify(data)
          .then((response) => {
            if (response.data.res === true) handleGetUserEarnings();
            setLoading(false);
          })
          .catch((error) => {
            toast.error("Something is wrong. The action did not completed");
            setLoading(false);
            navigate("/");
          });
      } catch (err) {
        toast.error("Can't complete the transaction");
        setLoading(false);
      }
    }
  };

  const handleGetUserEarnings = () => {
    if (localStorage.user === null) navigate("/");
    let user = JSON.parse(localStorage.user);
    let username = user.username;
    let data = { username: username };
    EarningService.getUserEarnings(data).then((response) => {
      let earningData = response.data.history;
      for (let i = 0; i < response.data.history.length; i++) {
        let time = new Date(response.data.history[i].time);
        earningData[i].time = time.toLocaleString();
      }
      setUserEarningHistory(earningData);
      setTotalEarning(response.data.total);
      setVerifed(response.data.verified);
      setWithdrawableEarning(response.data.withdrawable);
    });
  };

  useEffect(() => {
    handleGetUserEarnings();
  }, []);

  return (
    <div className={styles.withdraw_page_wrapper}>
      <Toaster position="top-center" reverseOrder={false} />
      {loading && <LoadingIndicator />}
      <div className={styles.container}>
        <div className={styles.total_earning}>
          <div className={styles.total_earning_title}>Total earning:</div>
          <div className={styles.total_earning_amount}>{totalEarning}</div>
        </div>
        <div className={styles.withdrawable_earning}>
          <div className={styles.withdrawable_earning_title}>Withdrawable:</div>
          <div className={styles.withdrawable_earning_amount}>
            {withdrawableEarning}
          </div>

          {verified ? (
            <FontAwesomeIcon icon={faCheck} className={styles.check_icon} />
          ) : (
            <FontAwesomeIcon icon={faTimes} className={styles.times_icon} />
          )}
          {verified === false && (
            <button
              className={styles.verify_button}
              onClick={handleVerifyClicked}
            >
              Verify
            </button>
          )}
        </div>
        <button
          className={styles.withdraw_button}
          onClick={handleWithdrawClicked}
        >
          Withdraw
        </button>
        <div className={styles.earning_history}>
          <div className={styles.row}>
            <div className={styles.history_time}>Time</div>
            <div className={styles.history_kind}>Game Kind</div>
            <div className={styles.history_type}>Award type</div>
            <div className={styles.history_amount}>Earning</div>
            <div className={styles.history_verified}>Verifed</div>
            <div className={styles.history_withdrawn}>Withdrawn</div>{" "}
          </div>
          {userEarningHistory.map((earning, idx) => (
            <div key={earning.id} className={styles.row}>
              <div className={styles.history_time}>{earning.time}</div>
              <div className={styles.history_kind}>{earning.kind}</div>
              <div className={styles.history_type}>{earning.type}</div>
              <div className={styles.history_amount}>{earning.amount}</div>
              <div className={styles.history_verified}>
                {earning.verified ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={styles.history_check_icon}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={styles.history_times_icon}
                  />
                )}
              </div>
              <div className={styles.history_withdrawn}>
                {earning.withdrawn ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={styles.history_check_icon}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={styles.history_times_icon}
                  />
                )}
              </div>{" "}
            </div>
          ))}
        </div>
      </div>
      {verifyConfirmModal && (
        <ConfirmModal
          confirmString={confirmString}
          width={300}
          height={150}
          closeClicked={cancelVerifyClicked}
          okClicked={okVerifyClicked}
        ></ConfirmModal>
      )}
    </div>
  );
}

export default WithdrawPage;
