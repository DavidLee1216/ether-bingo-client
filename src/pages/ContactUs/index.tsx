import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AUTH_LOGIN } from "../../store/actions/authActions/types";
import { ShowLoginBox } from "../../store/actions/userActions";
import { RootState } from "../../store/reducers";
import UserService from "../../services/user.service";
import toast, { Toaster } from "react-hot-toast";
import styles from "./contact_us.module.css";

function ContactUs() {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUserState = useSelector(
    (state: RootState) => state.AuthReducer.authUser
  );
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const sendFeedback = () => {
    let data = {
      username: authUserState.user.username,
      content: text,
    };
    if (text === "") {
      toast.error("The content cannot be empty.");
      return;
    } else if (text.length > 50000) {
      toast.error("The content is too long.");
      return;
    }
    UserService.contactUs(data)
      .then((response) => {
        toast.success("Sent your feedback successfully. Thank you.");
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (
      authUserState.authState !== AUTH_LOGIN &&
      localStorage.user === undefined
    ) {
      dispatch(ShowLoginBox());
      navigate("/");
    }
  }, []);

  return (
    <div className={styles.container}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className={styles.title}>Contact us</div>
      <textarea
        onChange={handleChange}
        value={text}
        placeholder="Type here. Your feedback is precious for us."
        className={styles.text_box}
      />
      <button className={styles.button} onClick={sendFeedback}>
        Send
      </button>
    </div>
  );
}

export default ContactUs;
