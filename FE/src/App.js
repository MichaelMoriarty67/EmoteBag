import './styles/App.css';
import React, { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import MintForm from './components/MintForm';
import EmoteHero from './components/EmoteHero';
import Footer from './components/Footer';
import FileDrop from './components/FileDrop';
const abi = require('./ABI/Emotes.json');


//***********************************************************/

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [mintLoading, setMintLoading] = useState(false);
  const [amtEmotes, setAmtEmotes] = useState(69);
  const [balance, setBalance] = useState('');
  const [ethConnection, setEthConnection] = useState(null);
  const [popupStatus, setPopupStatus] = useState(false);
  const EmotesAddress = '0xaAD75B1cd963350691AA020e3D786193B0381b25';
  const EmotesABI = abi.abi;
  const childFunc = useRef(null);

  const contractConnection = async () => {

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(EmotesAddress, EmotesABI, signer);

        
        const etherConnection = { // wrap all up in js literal obj
          provider: provider,
          signer: signer,
          contract: contract
        }

        setEthConnection(etherConnection); // add to the app state to share with componnets
      }

    } catch (err) {
      console.error("Error from contractConnection(): ", err);
    }
  }


  // check to see if someone has already logged into page with MM
  // if they have, hold address in app state under currentAccount
  const checkMetaMaskConnection = async () => {

    try {
      const { ethereum } = window;

      // check for eth object injected through metamask
      if (ethereum) {
        console.log("Nice, you have MetaMask injecting the ETH object", ethereum);
      } else {
        console.log("You need to get MetaMask");
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an account, woohoo!", account)
        setCurrentAccount(account)
      } else {
        console.log("no authed account found :(");
      }
    } catch (error) {
      console.log(error);
    }
  }


  // login from Wallet button
  const walletLogin = async () => {
    try {
        const { ethereum } = window;
        
        if (ethereum) {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
            console.log("Your ETH account set to address %s", accounts[0]);
            getNumEmotesMinted();

        } else {
            alert("You need to get metamask");
        }

    } catch(error) {
        console.log(error);
    }
    
  }

  // query # of emotes from contract storage
  const getNumEmotesMinted = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const emotesContract = new ethers.Contract(EmotesAddress, EmotesABI, signer);

        let count = await emotesContract.getTotalEmotesMinted();
        console.log("Emotes minted: %d", count.toNumber());
        setAmtEmotes(count.toNumber());
      } else {
        console.log("You need to get MetaMask");
      }
    } catch(error) {
      console.log(error);
    }

  }

  
  // listen for any emoteTransfer events and populate 
  const mintListenter = async () => {

    try {
        const { ethereum } = window;

        if (ethereum) {

            // connect to contract
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(EmotesAddress, EmotesABI, signer);

            contract.on("emoteTransfer", async (to, tokenId, tokenURI) => {
                console.log("Success from mintListener(): ", to, tokenId, tokenURI);
                const response = await fetch(`https://ipfs.io/ipfs/${tokenURI}`);
                const emoteJson = await response.json();
                childFunc.current(to, emoteJson.name, tokenURI, emoteJson.image, true); // should call EmoteHero -> emoteDataToState()
                getNumEmotesMinted();
                setMintLoading(false);

            })

            console.log("Listener is on home-slice")
        }

    } catch(error) {
        console.error("Error from mintListener(): ", error);
    }
  }
  
  const getBalance = async () => {

    try {
      const { ethereum } = window;
      if (ethereum) {
        const balWei = await ethereum.request({method: "eth_getBalance", params: ['0x4461056800b6BB9a47187a53d40aF0E90aA16FC0', "latest"]})
        const balEth = (parseInt(balWei, 16) / 1000000000000000000).toFixed(4);
        setBalance(balEth);
      }
    } catch (error) {
      console.error("Error from getBalance(): ", error);
    }
  }

  const togglePopup = () => {
    if (popupStatus == false) {
      setPopupStatus(true)
    } else {
      setPopupStatus(false)
    }
  }
  
  
  useEffect(() => {
    // check for eth obj from MetaMask and set currentAccount
    checkMetaMaskConnection(); 
    contractConnection();
    getNumEmotesMinted(); // get num emotes minted on page load
    getBalance();
    mintListenter(); // listen for new emote mints
  }, [])
  
  return (
    <div>
      <div style={ popupStatus == true ? {filter: 'blur(3px)'} : {}} className="big-wrapper" >
        <div className="data-container">

          <div className="header">
            <h1>🧙‍♂️ 🦀 ⚡️ EmoteBag ⚡️ 🦀 🧙‍♂️</h1>
            {currentAccount? (
              <div className="App-display-acc">
                <p>{balance} ETH</p>
                <div id="address">
                  <p>{currentAccount.substr(0,5).toUpperCase()}...{currentAccount.substr(-4,4).toUpperCase()}</p>
                </div>
              </div>
            ) : (
              <button className="header-login-button" onClick={walletLogin}>
                <p>Connect Wallet</p>
              </button>
            )}
          </div>

          {currentAccount ? (
            <div className="collection-container">
              <EmoteHero 
              emotesAddress={EmotesAddress}
              emotesABI={EmotesABI}
              userAddress={currentAccount}
              childFunc={childFunc}
              ethConnection={ethConnection}
              amtEmotes={amtEmotes}
              togglePopup={togglePopup}
              mintLoading={mintLoading}
              />
              {popupStatus ? (
                <div onClick={() => {togglePopup()}} className="background-cover" />
              ) : null }
            </div>
          ) : null }

          <Footer />

        </div>

      
      </div>
      {popupStatus ? (

        <div className="App-modal-popup">
          <MintForm 
            name="Upload Image"
            emotesAddress={EmotesAddress}
            emotesABI={EmotesABI}
            loading={mintLoading}
            setLoading={setMintLoading}
            ethConnection={ethConnection}
            togglePopup={togglePopup}
          />
        </div>

      ) : null }

    </div>
    
  )
}


export default App;
