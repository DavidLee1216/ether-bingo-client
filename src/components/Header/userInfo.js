import React, { useEffect } from "react";
import styled from "styled-components";

export default function UserInfoNav({ authUserState, bingoState }) {
  useEffect(() => {}, []);
  return (
    <UserWrapper>
      <div className="credits-div" style={{ color: "white" }}>
        {bingoState.credits}
      </div>
      <div className="account-div" style={{ color: "white" }}>
        {authUserState.user.username}
      </div>
    </UserWrapper>
  );
}

const UserWrapper = styled.div`
  display: flex;
`;
