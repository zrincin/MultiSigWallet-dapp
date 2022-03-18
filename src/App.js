import React, { useState, useEffect } from "react";
import web3 from "./web3";
import MSW from "./MSW";
import { Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import TransferList from "./components/TransferList";

const App = () => {
  const [accounts, setAccounts] = useState();
  const [balance, setBalance] = useState();
  const [currentTransfer, setCurrentTransfer] = useState();
  const [limit, setlimit] = useState();
  const [owners, setOwners] = useState([]);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [message, setMessage] = useState("");
  const [transfers, setTransfers] = useState([]);
  const [value, setValue] = useState("");
  const [showTransfers, setShowTransfers] = useState(false);

  useEffect(() => {
    const init = async () => {
      const accounts = await web3.eth.getAccounts();
      const balance = await web3.eth.getBalance(MSW.options.address);
      const limit = await MSW.methods.limit().call();
      const owners = await MSW.methods.getOwners().call();
      const transfers = await MSW.methods.getTransfers().call();

      setAccounts(accounts);
      setBalance(balance);
      setOwners(owners);
      setlimit(limit);
      setTransfers(transfers);
      setMessage("");
    };
    init();
    window.ethereum.on("accountsChanged", (accounts) => {
      setAccounts(accounts);
    });
  }, []);

  const updateBalance = async () => {
    const balance = await web3.eth.getBalance(MSW.options.address);
    setBalance(balance);
  };

  const createTransfer = async (e) => {
    e.preventDefault();
    setLoadingBtn(true);
    setMessage("Creating new transfer request, please wait...");

    if (e.target.elements[0].value === "" || e.target.elements[1] === "") {
      alert("Error: empty field(s). Please enter required information!");
      window.location.reload();
    }
    try {
      const to = e.target.elements[1].value;
      await MSW.methods
        .createTransferRequest(web3.utils.toWei(value, "ether"), to)
        .send({ from: accounts[0] });
      setMessage("Transfer request successfully created!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Transaction canceled!");
      setTimeout(() => setMessage(""), 3000);
    }
    setLoadingBtn(false);
    await updateCurrentTransfer();
  };

  const approveTransfer = async (currentTransferId) => {
    setLoadingBtn(true);
    setMessage("Approving transfer request, please wait...");
    try {
      await MSW.methods
        .approveTransferRequest(currentTransferId)
        .send({ from: accounts[0] });
      setMessage("Transfer approved!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Transaction canceled!");
      setTimeout(() => setMessage(""), 3000);
    }
    setLoadingBtn(false);
    await updateBalance();
    await updateCurrentTransfer();
  };

  const updateCurrentTransfer = async () => {
    let currentTransferId = await MSW.methods.getTransfers().call();
    currentTransferId = currentTransferId.length - 1;
    if (currentTransferId >= 0) {
      const currentTransfer = await MSW.methods
        .transfers(currentTransferId)
        .call();
      const alreadyApproved = await MSW.methods
        .isApproved(accounts[0], currentTransferId)
        .call();
      setCurrentTransfer({ ...currentTransfer, alreadyApproved });
    }
  };

  if (!web3 || typeof accounts === "undefined" || owners.length === 0) {
    return (
      <>
        <h1>Loading...</h1>
        <h3>
          {" "}
          (If no content - switch network to Rinkeby and reload the page)
        </h3>
      </>
    );
  }

  return (
    <div className="container" style={{ overflow: "auto" }}>
      <h1 className="text-center" style={{ marginTop: 20 }}>
        Multi Signature Wallet
      </h1>
      <h3 className="text-center" style={{ marginTop: -10 }}>
        (required signatures: {limit})
      </h3>
      <br />
      <div className="row">
        <div className="col-sm-12">
          <p>
            Contract address: <b>{MSW.options.address}</b>
            <br />
            Contract balance:{" "}
            <b>
              {balance} wei &nbsp;&nbsp;(
              {web3.utils.fromWei(balance, "ether")} ETH)
            </b>
            <br /> <br />
          </p>
        </div>
      </div>
      {!currentTransfer || currentTransfer.approvals === limit ? (
        // CREATE TRANSFER
        <div className="row">
          <div className="col-sm-12">
            <h2>Create transfer request</h2>
            <form onSubmit={createTransfer}>
              <div className="form-group">
                <label htmlFor="amount">
                  <b>Amount [ETH]:</b>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="amount"
                  placeholder="Enter amount in ether"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="to">
                  <b>To:</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="to"
                  placeholder="Enter address of beneficiary"
                />
              </div>
              <Button tertiary="true" loading={loadingBtn}>
                Create
              </Button>
            </form>
            <br />
            <h4>Owners:</h4>
            {owners &&
              owners.map((owner, index) => {
                return <li key={index}>{owner}</li>;
              })}
            <br />
            <h2>{message}</h2>
            <br />
            <button
              onClick={() => setShowTransfers(!showTransfers)}
              style={{ marginBottom: 20 }}
            >
              {showTransfers ? "Hide transfer list" : "Show transfer list"}
            </button>
            {showTransfers ? (
              <TransferList
                transfers={transfers}
                approveTransfer={approveTransfer}
              />
            ) : null}
          </div>
        </div>
      ) : (
        //APPROVE TRANSFER
        <div className="row">
          <div className="col-sm-12">
            <h2>Approve transfer request</h2>
            <ul>
              <li>TransferID: {currentTransfer.ID}</li>
              <li>
                Amount: {currentTransfer.amount} wei &nbsp;&nbsp;(
                {web3.utils.fromWei(currentTransfer.amount, "ether")} ETH)
              </li>
              <li>Beneficiary: {currentTransfer.to}</li>
              <li>
                Approvals: {currentTransfer.approvals} / {limit}
              </li>
            </ul>
            {!currentTransfer.alreadyApproved ? (
              <Button
                type="submit"
                primary
                loading={loadingBtn}
                onClick={() => approveTransfer(currentTransfer.ID)}
              >
                Approve
              </Button>
            ) : (
              <h4>Already approved by this account/address!</h4>
            )}
            <h2>{message}</h2>
          </div>
        </div>
      )}
      <br /> <br /> <br /> <br /> <br />
      <footer
        style={{
          backgroundColor: "#ECF0F1",
          position: "fixed",
          width: "100%",
          left: 0,
          bottom: 0,
        }}
      >
        <div style={{ textAlign: "center" }}>
          &copy; ZrinCin, {new Date().getFullYear()}
          {"."}
        </div>
      </footer>
    </div>
  );
};

export default App;
