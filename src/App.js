import React, { useEffect, useState, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import web3 packages
import Web3 from 'web3';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

// Import ABI
import TokenVesting from './contract/Vesting.json';

import WalletBox from './components/WalletBox';

const huhTokenAddress = "0xc15e89f2149bCC0cBd5FB204C9e77fe878f1e9b2";
let vestingContractAddress = "0xeaEd594B5926A7D5FBBC61985390BaAf936a6b8d";
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

function App() {
  const [providerSrc, setProviderSrc] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  // const [_, setNetworkId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [amount, setAmount] = useState(1);
  const [lockId, setLockId] = useState('');

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

        if (_networkId !== netId) {
          errorAlert("Failed to connect BSC mainnet");
          setWalletAddress(null);
        }
      }
    }
  }, [errorAlert])

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

  const successAlert = (msg) => {
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
  }

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
      // setNetworkId(_networkId)

      if (_networkId !== netId) {
        errorAlert("Failed to connect BSC testnet");
        setWalletAddress(null);
      } else {
        successAlert("Wallet Connected!");
      }
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

const getWithdrawableTokens = async (tokenContract, lockId) => {
  try {
    const result = await tokenContract.methods.getWithdrawableTokens(lockId).call();
    return result;
  } catch (err) {
    console.log(err)
  }
}

const getUserLocksForTokenLength = async (tokenContract, payee_address, token_address) => {
  try {
    const result = await tokenContract.methods.getUserLocksForTokenLength(payee_address, token_address).call();
    return result;
  } catch (err) {
    console.log(err)
  }
}

const getUserLockIDForTokenAtIndex = async (tokenContract, payee_address, token_address, index) => {
  try {
    const result = await tokenContract.methods.getUserLockIDForTokenAtIndex(payee_address, token_address, index).call();
    return result;
  } catch (err) {
    console.log(err)
  }
}

const removeExtraSpace = (s) => s.trim().split(/ +/).join(' ')

const range = (s, e) => Array.from('x'.repeat(e - s), (_, i) => s + i);

const handleLockId = async (e) => {
  // const constAmount = amount;
  // console.log(constAmount)
  const value = e.target.value;
  const lockId = removeExtraSpace(value);
  const wallet = walletAddress;
  setLockId(lockId);
  if (lockId === "")
    return;
  // const am = amount;
  // console.log(value);
  // console.log(am);
  // console.log(lockId);
  try {
    if (walletAddress == null)
      throw Error("Conect the wallet first by clicking on the red link between the HUH logo and the wallet icon...")
    const tokenVest = new web3.eth.Contract(TokenVesting, vestingContractAddress);
    // console.log(wallet);
    const myLocksLength = await getUserLocksForTokenLength(tokenVest, wallet, huhTokenAddress);
    // console.log(myLocksLength);
    const locks = await Promise.all(range(0, myLocksLength).map(async index => {
      return await getUserLockIDForTokenAtIndex(tokenVest, wallet, huhTokenAddress, index)
    }));
    // console.log("Locks found: " + locks);
    const myLockId = locks.filter(lock => lock === lockId);
    if (myLockId.length !== 1) {
      throw Error("Lock not found!");
    }
    successAlert("Lock found!");
    console.log(myLockId);
    const withdrawableTokens = await getWithdrawableTokens(tokenVest, lockId);
    setAmount(withdrawableTokens);
    // console.log(withdrawableTokens);
    const fromWei = web3.utils.fromWei(withdrawableTokens, 'ether');
    console.log(fromWei);
    setTotalAmount(fromWei);
    // let customer = await this.service.getCustomer(customerCode);
    // this.setState({ customer });

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
        <span>Input LockID</span>
        <input
          value={lockId}
          onChange={handleLockId}
        />
        <br />
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
