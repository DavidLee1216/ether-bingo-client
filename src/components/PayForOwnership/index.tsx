import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import CloseIcon from "@mui/icons-material/Close";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { ethers } from "ethers";
import abi from "../../contracts/EtherBingo.json";
import toast, { Toaster } from "react-hot-toast";
import RoomService from "../../services/room.service";
import { getWonRoomAuction } from "../../store/actions/roomActions";
import styles from "./pay_for_ownership.module.css";
import LoadingIndicator from "../../utils/loading";
import { sleep } from "../../utils/common";

type WonRoomType = {
  room_id: number;
  won_price: number;
  expire_date: string;
};
function PayForOwnership({ closeClicked }: { closeClicked: Function }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const contractAddress: string = process.env.REACT_APP_CONTRACT_ADDRESS!;
  const contractABI = abi.abi;
  const dispatch = useDispatch();
  const roomState = useSelector((state: RootState) => state.WonReducer);
  const authUserState = useSelector(
    (state: RootState) => state.AuthReducer.authUser
  );
  const user = authUserState.user;

  const handlePayForOwnership = async (room_id: number, won_price: number) => {
    try {
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
        let userId = user.id;
        let data = {
          username: user.username,
          room_id: room_id,
          amount: won_price,
        };
        setLoading(true);
        console.log("clicked");
        // await sleep(2000000);
        await RoomService.assignOwnership(data)
          .then(async (response) => {
            let from_time = response.data.from;
            let to_time = response.data.to;
            let from_datetime = Math.round(
              new Date(from_time).getTime() / 1000
            );
            let to_datetime = Math.round(new Date(to_time).getTime() / 1000);
            try {
              const txn = await tokenContract.payForOwnership(
                userId.toString(),
                room_id.toString(),
                ethers.utils.parseEther(won_price.toString()),
                from_datetime,
                to_datetime,
                {
                  value: ethers.utils.parseEther(won_price.toString()),
                }
              );
              await txn.wait();
              RoomService.payForOwnership(data)
                .then((response1) => {
                  console.log("success");
                })
                .catch((error) => {
                  let data = {
                    username: user.username,
                    room_id: room_id,
                    from_time: response.data.from,
                    to_time: response.data.to,
                  };
                  RoomService.removeOwnership(data)
                    .then((response) => {
                      console.log("successfully deleted");
                    })
                    .catch((err) => {
                      console.log("Failed to delete");
                    });
                  setLoading(false);
                  return;
                });
            } catch (err) {
              let data = {
                username: user.username,
                room_id: room_id,
                from_time: response.data.from,
                to_time: response.data.to,
              };
              RoomService.removeOwnership(data)
                .then((response) => {
                  console.log("successfully deleted");
                })
                .catch((err) => {
                  console.log("Failed to delete");
                });
              setLoading(false);
              return;
            }
            dispatch(getWonRoomAuction());

            toast.success(`You owned ${room_id} bingo room`);
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
      toast.error("Can't complete the transaction");
      console.log(error);
    }
  };
  const handleClose = () => {
    closeClicked();
  };
  return (
    <div className={styles.pay_for_ownership_wrapper}>
      <Toaster position="top-center" reverseOrder={false} />
      {loading && <LoadingIndicator />}
      <div className={styles.pay_for_ownership_box_container}>
        <div className={styles.wrapper_relative_box}>
          <div className={styles.box_title}>Pay and own your room</div>
          <div className={styles.expire_date_warning}>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className={styles.warning_icon}
            ></FontAwesomeIcon>
            Please pay before expiry date. Or you will lose the chance to own
            the room
          </div>
          {roomState.won_rooms.length === 0 && closeClicked()}
          <div className={styles.pay_for_ownership_box}>
            {roomState.won_rooms.map((won_room: WonRoomType, idx: number) => (
              <div className={styles.won_room_box} key={idx}>
                <div className={styles.won_room_id}>
                  <span className={styles.title}>room id:</span>{" "}
                  {won_room.room_id}
                </div>
                <div className={styles.won_price}>
                  <span className={styles.title}>price:</span>{" "}
                  {won_room.won_price}
                  <span className={styles.eth}>ETH</span>
                </div>
                <div
                  className={styles.pay_for_ownership_button}
                  onClick={() =>
                    handlePayForOwnership(won_room.room_id, won_room.won_price)
                  }
                >
                  Pay
                </div>
                <div className={styles.expire_date}>
                  <div>expiry date:</div>
                  <div className={styles.expire_date_time}>
                    {won_room.expire_date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.close_button} onClick={handleClose}>
          <CloseIcon width="16" height="16" fill="black"></CloseIcon>
        </div>
      </div>
    </div>
  );
}

export default PayForOwnership;
