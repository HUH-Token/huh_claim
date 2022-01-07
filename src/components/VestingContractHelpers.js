const vestingContractAddress = "0xeaEd594B5926A7D5FBBC61985390BaAf936a6b8d";
const LOCKS = async (tokenContract, lockId) => {
    try {
      const result = await tokenContract.methods.LOCKS(lockId).call();
      return result;
    } catch (err) {
      console.log(err)
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

  export {vestingContractAddress, getUserLockIDForTokenAtIndex, getUserLocksForTokenLength, getWithdrawableTokens, LOCKS}