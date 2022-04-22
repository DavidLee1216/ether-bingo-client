import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import LoadingIndicator from "../../utils/loading";
import { authorize } from "../../store/actions/authActions";
import axiosInstance from "../../axios";

function AuthenticationPage() {
  const { id, key } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id !== undefined && key !== undefined) {
      setLoading(true);
      const data = { id: id, key: key };
      dispatch(authorize(data))
        .then((response) => {
          setLoading(false);
          navigate("/");
        })
        .catch((error) => {
          console.log("error auth");
          setLoading(false);
        });
    } else {
      console.log(localStorage.user);
      if (localStorage.token) {
        navigate("/");
      }
    }
  }, []);
  return (
    <WrapperAuth>
      {loading && <LoadingIndicator />}
      <VerifyAuth>Verify your email</VerifyAuth>
    </WrapperAuth>
  );
}

const WrapperAuth = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(10, 10, 10, 0.4);
  backdrop-filter: blur(10px);
  z-index: 121;
`;

const VerifyAuth = styled.div`
  margin: auto;
  color: white;
`;
export default AuthenticationPage;
