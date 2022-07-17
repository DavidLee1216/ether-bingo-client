import React from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderLogo from "../HeaderLogo";
import { ReactComponent as LinkedinIcon } from "../../assets/img/linkedin.svg";
import { ReactComponent as FacebookIcon } from "../../assets/img/facebook.svg";
import { ReactComponent as InstagramIcon } from "../../assets/img/instagram.svg";
import { ReactComponent as TwitterIcon } from "../../assets/img/twitter.svg";
import styles from "./footer.module.css";

export default function Footer() {
  const navigate = useNavigate();
  const url = window.location;
  const host = window.location.hostname;
  let text = "This is a ETH bingo game site.";
  // let summary = "Join this website and play together.";

  const handleContactClicked = () => {
    navigate("/contact");
  };

  return (
    <div className={styles.footer_wrapper}>
      <div className={styles.container}>
        <div className={`d-none d-sm-block d-inline-block ${styles.item}`}>
          <HeaderLogo></HeaderLogo>
        </div>
        <div className={`${styles.social_wrapper} ${styles.item}`}>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon width={30} height={30} />
          </a>
          <a
            href={`https://twitter.com/share?url=${url}&text=${text}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon width={30} height={30} />
          </a>
          <a
            href={`https://www.linkedin.com/cws/share?url=${url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedinIcon width={30} height={30} />
          </a>
          <a
            href={`https://www.instagram.com/?url=${host}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon width={30} height={30} />
          </a>
        </div>
        <div className={`${styles.item} ${styles.contact}`}>
          <span className={styles.contact_us} onClick={handleContactClicked}>
            Contact us
          </span>
        </div>
        <div className={`${styles.item} ${styles.help}`}>
          <div className={`${styles.terms_and_conditions}`}>
            <Link to="/terms">Terms and Conditions</Link>
          </div>
          <div className={`${styles.how_it_works}`}>
            <Link to="/about">How it works</Link>
          </div>
          <div className={`${styles.about_bingo_game}`}>
            <Link to="/help/bingo">About Bingo game</Link>
          </div>
          <div className={`${styles.about_room_auction}`}>
            <Link to="/help/auction">About Room Auction</Link>
          </div>
        </div>
        <div className={`${styles.item} ${styles.address}`}>
          <div className="text-white text-center">
            Our services facilitated by this website are operated by Crown
            Gaming Limited, a company incorporated in the Republic of Iceland.
            Crown Gaming Limited is licensed and regulated in Iceland by the
            Gambling Commission under the account number 58387.
          </div>
        </div>
      </div>
    </div>
  );
}
