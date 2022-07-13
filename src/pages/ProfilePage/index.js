import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import countryList from "react-select-country-list";
// import CountryDropdown from "country-dropdown-with-flags-for-react";
import Select from "react-select";
import { ReactComponent as MetaMaskIcon } from "../../assets/img/metamask.svg";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import UserService from "../../services/user.service";
import { setMainWallet } from "../../store/actions/authActions";
import "./profile.css";
import LoadingIndicator from "../../utils/loading";
import abi from "../../contracts/EtherBingo.json";

function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [wallet, setWallet] = useState("");
  const [profileExist, setProfileExist] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.user);
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const contractABI = abi.abi;

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
      } else {
        setError("Please install a MetaMask wallet to play bingo.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      setIsWalletConnected(false);
      console.log(error);
    }
  }, []);

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
    if (!isWalletConnected) {
      toast.error("Please connect main wallet");
      return;
    }
    let profile = {
      username: user.username,
      country: country.label,
      city: city,
      sex: gender.label,
      wallet: wallet,
    };
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    if (profileExist === false && account !== wallet) {
      toast.error(
        "Connected address is different from wallet address. Check your wallet and reconnect to it."
      );
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    setLoading(true);
    // await sleep(1000);
    UserService.setProfile(profile).then(
      async (response) => {
        try {
          if (profileExist === false) {
            await tokenContract.setMainWallet(user.id);
            dispatch(setMainWallet(wallet));
          }
          setProfileExist(true);
          toast.success("Profile saved successfully.");
        } catch (error) {
          toast.error("Error occured while set your wallet");
        }
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
        setProfileExist(true);
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
          <div className="wallet">
            {isWalletConnected && (
              <div className="text-white pe-3">{wallet}</div>
            )}
            {profileExist === false && (
              <div className="wallet-button" onClick={checkIfWalletIsConnected}>
                <MetaMaskIcon width={25} height={25}></MetaMaskIcon>
                <span style={{ fontWeight: "bold", marginLeft: "2rem" }}>
                  {isWalletConnected ? "Reconnect" : "MetaMask"}
                </span>
              </div>
            )}
          </div>
        </div>

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
