import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import RoomAuction from "../RoomAuction";
import RoomService from "../../services/room.service";
import "./room_auctions.css";

const controller = new AbortController();

function RoomAuctions() {
  const [data, setData] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  let row_count = width < 630 ? 1 : width < 960 ? 2 : 3;
  const timer = useRef();
  const setTimerInterval = () => {
    timer.current = setInterval(displayData, 1000);
  };
  const getData = useCallback(() => {
    RoomService.getRooms()
      .then(
        (response) => {
          let d = [];
          for (let i = 0; i < response.data.length; i += row_count)
            d.push(response.data.slice(i, i + row_count));
          setData(d);
        }
        // (error) => {}
      )
      .catch((error) => {
        console.log(error);
      });
  });
  const displayData = useCallback(() => {
    if (timer.current !== undefined) getData();
  });
  const handleResize = useCallback(() => {
    setWidth(window.innerWidth);
    row_count = window.innerWidth < 630 ? 1 : window.innerWidth < 960 ? 2 : 3;
    // console.log(window.innerWidth);
  });
  useLayoutEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    getData();
    setTimerInterval();
    return () => {
      clearInterval(timer.current);
      timer.current = undefined;
      controller.abort();
    };
  }, []);

  return (
    <div>
      <div className="room-auctions mx-auto">
        {data.map((row, idx) => (
          <div className="room-auctions-row-wrapper" key={idx}>
            {row.map((value) => (
              <RoomAuction key={value.room_id} data={value}></RoomAuction>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomAuctions;
