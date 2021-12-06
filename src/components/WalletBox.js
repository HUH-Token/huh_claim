const WalletBox = (props) => {
  const { connect, disConnect, walletAddress } = props;
  return (
    <div
      className="wallet-connect"
      onClick={() => {
        if (walletAddress) {
          disConnect()
        } else {
          connect()
        }
      }}
    >
      <img src="img/new/wallet-logo.svg" />
      {
        walletAddress ?
          <img src="img/new/wallet-connect.svg" /> :
          <img src="img/new/wallet-disconnect.svg" />
      }
      <img src="img/new/wallet-box.svg" />
    </div>
  )
}

export default WalletBox;