import React, { useEffect, useState, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import web3 packages
import Web3 from 'web3';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Select from "react-select";
import makeAnimated from "react-select/animated";

// Import ABI
import TokenVesting from './contract/Vesting.json';

import WalletBox from './components/WalletBox';
import {vestingContractAddress, getUserLockIDForTokenAtIndex, getUserLocksForTokenLength, getWithdrawableTokens, LOCKS} from './components/VestingContractHelpers'
import range from './components/Range';

const animatedComponents = makeAnimated();
const huhTokenAddress = "0xc15e89f2149bCC0cBd5FB204C9e77fe878f1e9b2";
let tokenVest;
let netId = 56;
let web3Modal = null;
let provider = null;
let web3 = null;
let providerOptions = {
  // walletconnect: {
  //   package: WalletConnectProvider,
  //   options: {
  //     infuraId: "8cb16bcb42ca4118adfe40b2fe703286"
  //   }
  // },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        56: 'https://bsc-dataseed.binance.org/'
      },
      network: 'binance',
    }
  }
};

web3Modal = new Web3Modal({
  // network: netId,
  cacheProvider: true,
  providerOptions,
  disableInjectedProvider: false
})

function LockIdDetails(props) {
  if (props.lockId === null)
    return null
  return (
    <>
      <span>LockId Details</span>
      <input
        value={props.startEmissionDate}
        onChange={() => { }}
        disabled
      />
      <input
        value={props.endEmissionDate}
        onChange={() => { }}
        disabled
      />
      <input
        value={" HUH"}
        onChange={() => { }}
        disabled
      />
    </>
  );
}

function App() {
  const [providerSrc, setProviderSrc] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [amount, setAmount] = useState(1);
  const [lockId, setLockId] = useState(null);
  const [lockIds, setLockIds] = useState([]);
  const [startEmissionDate, setStartEmissionDate] = useState(null);
  const [endEmissionDate, setEndEmissionDate] = useState(null);

  const errorAlert = useCallback(async (msg) => {
    toast.error(msg, {
      position: "top-right",
      theme: 'colored',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    format();
  }, [])

  const successAlert = useCallback((msg) => {
    toast.success(msg, {
      position: "top-right",
      theme: 'colored',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    format();
  }, [])

  const walletConnectedReaction = useCallback(async (accounts, networkId) => {
    if (networkId !== netId) {
      errorAlert("Failed to connect BSC mainnet");
      setWalletAddress(null);
    } else {
      successAlert("Wallet Connected!");
      tokenVest = new web3.eth.Contract(TokenVesting, vestingContractAddress);
      // console.log(wallet);
      const myLocksLength = await getUserLocksForTokenLength(tokenVest, accounts[0], huhTokenAddress);
      // console.log(myLocksLength);
      const locks = await Promise.all(range(0, myLocksLength).map(async index => {
        return await getUserLockIDForTokenAtIndex(tokenVest, accounts[0], huhTokenAddress, index)
      }));
      if (locks.length === 0){
        errorAlert("No locks found!")
        return
      }
      const lockSelectionOptions = locks.map(lockNumber => {
        return { value: lockNumber, label: lockNumber }
      })
      setLockIds(lockSelectionOptions);
      successAlert("Locks found:" + locks);
    }
  }, [errorAlert, successAlert])



  const cachedConnect = useCallback(async () => {
    if (web3Modal.cachedProvider) {
      let hasProvider;
      try {
        provider = await web3Modal.connect();
        hasProvider = true;
      } catch (error) {
        console.log("provider error: ", error);
        hasProvider = false;
      }
      if (hasProvider) {
        setProviderSrc(provider);
        web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        setWalletAddress(accounts[0])
        const _networkId = await web3.eth.net.getId();
        // setNetworkId(_networkId)
        await walletConnectedReaction(accounts, _networkId)
      }
    }
  }, [walletConnectedReaction])

  useEffect(() => {
    cachedConnect();
  }, [cachedConnect])

  useEffect(() => {
    if (providerSrc) {
      (async () => {
        await subscribeProvider(providerSrc);
      })();
    }
  }, [providerSrc])

  const warningAlert = (msg) => {
    toast.warning(msg, {
      position: "top-right",
      theme: 'colored',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    format();
  }

  const format = () => {
    setTotalAmount(0);
  }

const connect = async () => {
  if (web3Modal) {
    let hasProvider;
    try {
      provider = await web3Modal.connect();
      hasProvider = true;
    } catch (error) {
      console.log("provider error: ", error);
      hasProvider = false;
    }
    if (hasProvider) {
      setProviderSrc(provider)
      try {
        await subscribeProvider(provider);
      } catch (error) {
        console.log("subscribe error: ", error);
      }
      web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      setWalletAddress(accounts[0])
      const _networkId = await web3.eth.net.getId();
      await walletConnectedReaction(accounts, _networkId)
    }
  } else {
    console.log("web3Modal is null");
  }
}

const subscribeProvider = async (provider) => {
  if (!provider.on) {
    return;
  }
  provider.on("accountsChanged", async (accounts) => {
    setWalletAddress(accounts[0]);
  });
  provider.on("networkChanged", async (networkId) => {
    // setNetworkId(networkId);
  });
};

const disConnect = async () => {
  try {
    if (web3Modal) {
      await web3Modal.clearCachedProvider();
    }
    if (provider) {
      provider = null;
      setProviderSrc(provider);
      setWalletAddress(null);
      warningAlert("Wallet Disconnected");
    }
  } catch (error) {
    console.log(error);
  }
}

const handleLockId = async (e) => {
  const myLockId = e.value;
  try {
    if (walletAddress == null)
      throw Error("Connect the wallet first by clicking on the red link between the HUH logo and the wallet icon...")
    successAlert("Lock " + myLockId + " found");
    console.log(myLockId);
    const selectedLockInfo = await LOCKS(tokenVest, myLockId);
    // console.log(selectedLockInfo.condition);
    // console.log(selectedLockInfo.endEmission);
    // console.log(selectedLockInfo.lockID);
    // console.log(selectedLockInfo.owner);
    // console.log(selectedLockInfo.sharesDeposited);
    // console.log(selectedLockInfo.sharesWithdrawn);
    const startEmissionDate = new Date(selectedLockInfo.startEmission*1000);
    const endEmissionDate = new Date(selectedLockInfo.endEmission*1000);
    setStartEmissionDate(startEmissionDate);
    setEndEmissionDate(endEmissionDate);
    setLockId(myLockId);
    console.log(startEmissionDate);
    console.log(endEmissionDate);
    // console.log(selectedLockInfo.startEmission);
    // console.log(selectedLockInfo.tokenAddress);
    const withdrawableTokens = await getWithdrawableTokens(tokenVest, myLockId);
    setAmount(withdrawableTokens);
    const fromWei = web3.utils.fromWei(withdrawableTokens, 'ether');
    console.log(fromWei);
    setTotalAmount(fromWei);
  } catch (err) {
    errorAlert(err.message);
    return null;
  }
}

const withdraw = async (lockId) => {
  try {
    const tokenVesting = new web3.eth.Contract(TokenVesting, vestingContractAddress);
    const am = amount;
    await tokenVesting.methods.withdraw(lockId, am).send({ from: walletAddress })
      .on('transactionHash', function (hash) {
        console.log("allowance hash: ", hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        console.log("allowance confirmed!");
      })
      .on('error', function (error) {
        if (error) {
          return;
        }
      })
      .then(function () {
        successAlert("Withdraw Success!")
      });
  } catch (err) {
    errorAlert(err.message);
    return null;
  }
}

return (
  <section className="huh-claim-section">
    <div className="contain">
      <WalletBox
        walletAddress={walletAddress}
        connect={connect}
        disConnect={disConnect}
      />
      <div className="inner-contain">
        <span>Select Input LockID</span>
        <Select options={lockIds} components={animatedComponents} onChange={handleLockId}/>
        &nbsp;
        <LockIdDetails lockId={lockId} startEmissionDate={startEmissionDate} endEmissionDate={endEmissionDate}/>
        <span>Total Amount</span>
        <input
          value={Number(totalAmount * 1E9).toFixed(9) + " HUH"}
          onChange={() => { }}
          disabled
        />
        <button
          onClick={() => {
            if (walletAddress) {
              if (lockId) {
                withdraw(lockId)
              } else {
                warningAlert("Please input lock id");
              }
            } else {
              warningAlert("Please connect wallet");
            }
          }}
        >
          CLAIM
        </button>
      </div>
    </div>
    <ToastContainer />
  </section>
);
}

export default App;
