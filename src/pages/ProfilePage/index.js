import React, { useState, useCallback, useMemo, useEffect } from "react";
import countryList from "react-select-country-list";
// import CountryDropdown from "country-dropdown-with-flags-for-react";
import Select from "react-select";
import { ethers, utils } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import UserService from "../../services/user.service";
import "./profile.css";
import LoadingIndicator from "../../utils/loading";

function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [wallet, setWallet] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.user);

  const countryOptions = useMemo(() => countryList().getData(), []);
  const genderOptions = [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
  ];

  const changeCountryHandler = (value) => {
    setCountry(value);
    // setCountry(e.target.value);
  };
  const changeCityHandler = (event) => {
    setCity(event.target.value);
  };
  const changeGenderHandler = (value) => {
    setGender(value);
  };
  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setIsWalletConnected(true);
        setWallet(account);
        setError(null);
        console.log("Account Connected: ", account);
      } else {
        setError("Please install a MetaMask wallet to play bingo.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      setIsWalletConnected(false);
      console.log(error);
    }
  }, []);

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const saveProfile = async (e) => {
    if (country === "") {
      toast.error("Please select coutry");
      return;
    }
    if (city === "") {
      toast.error("Please set city");
      return;
    }
    if (gender === "") {
      toast.error("Please select your gender");
      return;
    }
    if (city.length >= 200) {
      toast.error("Address is too long");
      return;
    }
    let profile = {
      username: user.username,
      country: country.label,
      city: city,
      sex: gender.label,
      wallet: wallet,
    };
    setLoading(true);
    // await sleep(1000);
    UserService.setProfile(profile).then(
      (response) => {
        toast.success("Profile saved successfully.");
      },
      (error) => {
        if (error.response.status === 409) {
          toast.error("Main wallet is already in use");
          return;
        }
        toast.error("Something is wrong.");
      }
    );

    setLoading(false);
  };
  const getProfile = () => {
    let data = {
      username: user.username,
    };
    UserService.getProfile(data).then(
      (response) => {
        let username = response.data.username;
        let cc = countryOptions.find(
          (elem) => elem.label === response.data.country
        );
        let sex = genderOptions.find(
          (elem) => elem.label === response.data.sex
        );
        setCountry(cc);
        setCity(response.data.city);
        setGender(sex);
        setWallet(response.data.main_wallet);
        setIsWalletConnected(true);
      },
      (error) => {
        console.log(error.response.data);
      }
    );
  };
  useEffect(() => {
    getProfile();
  }, []);
  return (
    <div className="profile">
      <Toaster position="top-center" reverseOrder={false} />
      {loading && <LoadingIndicator />}

      <div className="profile-box col-10 col-md-5 pt-5 mx-auto">
        {error && <div>{error}</div>}
        <div className="profile-title text-center">MY PROFILE</div>
        <div className="country-wrapper d-flex">
          <div className="text-white col-4">Country:</div>
          <Select
            options={countryOptions}
            value={country}
            defaultInputValue={country}
            onChange={changeCountryHandler}
            className="country-select col-7"
          />
          {/* <CountryDropdown
            id="country_dropdown"
            className="country-select col-12"
            preferredCountries={["gb", "us"]}
            value={country}
            width="200px"
            readonly
            handleChange={changeCountryHandler}
          ></CountryDropdown> */}
        </div>
        <div className="city-wrapper d-flex">
          <div className="text-white col-4">Address:</div>
          <input
            className="city-input col-7"
            type="text"
            placeholder="Street, City, State"
            defaultValue={city}
            onChange={changeCityHandler}
          ></input>
        </div>
        <div className="gender-wrapper d-flex">
          <div className="text-white col-4">Gender:</div>
          <Select
            className="city-select col-7"
            options={genderOptions}
            value={gender}
            defaultInputValue={gender}
            onChange={changeGenderHandler}
          ></Select>
        </div>
        <div className="main-wallet-wrapper d-flex">
          <div className="text-white col-4">Main Wallet:</div>
          <div className="text-white col-7">{wallet}</div>
        </div>
        {!isWalletConnected ? (
          <button className="wallet-button" onClick={checkIfWalletIsConnected}>
            {isWalletConnected ? "Wallet Connected 🔒" : "Connect Wallet 🔑"}
          </button>
        ) : (
          <div></div>
        )}
        <div className="buttons d-flex justify-content-center">
          <button className="save-button" onClick={saveProfile}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;
