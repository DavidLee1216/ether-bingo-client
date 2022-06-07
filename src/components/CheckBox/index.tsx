import React, { useEffect, useRef, useState } from "react";
import "../../assets/css/common.css";

type CheckBoxType = {
  checkClicked: Function;
  defaultChecked: boolean;
};

function CheckBox({ checkClicked, defaultChecked }: CheckBoxType) {
  const [check, setCheck] = useState(false);
  const checkClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheck(!check);
    checkClicked(e.target.checked);
  };

  useEffect(() => {
    setCheck(false);
  }, [defaultChecked]);

  return (
    <div>
      <label className="checkBox">
        <input
          className="d-none"
          type="checkbox"
          checked={check}
          onChange={checkClick}
        ></input>
        <i></i>
      </label>
    </div>
  );
}

export default CheckBox;
