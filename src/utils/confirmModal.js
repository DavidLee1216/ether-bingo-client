import React, { useState } from "react";
import styled from "styled-components";

function ConfirmModal({
  confirmString,
  width,
  height,
  closeClicked,
  okClicked,
}) {
  return (
    <FixedWrapper>
      <ModalWrapper style={{ width: width, height: height }}>
        <div style={{ padding: "20px", fontWeight: "bold", fontSize: "1.2em" }}>
          {confirmString}
        </div>
        <ButtonWrapper>
          <button
            style={{
              width: "80px",
              height: "40px",
              backgroundColor: "rgb(255, 255, 255)",
              fontSize: "1rem",
              fontWeight: "bold",
              boxShadow: "1px 1px 1px 1px rgb(158, 158, 158)",
              //   border: "2px solid blue",
              borderRadius: "5px",
            }}
            onClick={closeClicked}
          >
            Cancel
          </button>
          <button
            style={{
              width: "80px",
              height: "40px",
              backgroundColor: "rgb(255, 255, 255)",
              fontSize: "1rem",
              fontWeight: "bold",
              boxShadow: "1px 1px 1px 1px rgb(158, 158, 158)",
              //   border: "2px solid green",
              borderRadius: "5px",
            }}
            onClick={okClicked}
          >
            OK
          </button>
        </ButtonWrapper>
      </ModalWrapper>
    </FixedWrapper>
  );
}

const FixedWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0);
  z-index: 10;
`;

const ModalWrapper = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  border-radius: 10px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

export default ConfirmModal;
