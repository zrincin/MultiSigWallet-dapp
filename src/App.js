import React, { useState, useEffect } from "react";
import web3 from "./web3";
import MSW from "./MSW";
import { Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const App = () => {
  const [accounts, setAccounts] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [currentTransfer, setCurrentTransfer] = useState(undefined);
  const [limit, setlimit] = useState(undefined);
  const [owners, setOwners] = useState(undefined);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");

  useEffect(() => {
    const init = async () => {
      const accounts = await web3.eth.getAccounts();
      const limit = await MSW.methods.limit().call();
      const owners = await MSW.methods.getOwners().call();

      setAccounts(accounts);
      setOwners(owners);
      setlimit(limit);
      updateBalance();
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

    const amount = e.target.elements[0].value;
    const to = e.target.elements[1].value;
    await MSW.methods
      .createTransferRequest(amount, to)
      .send({ from: accounts[0] });
    setLoadingBtn(false);
    setMessage(`Transfer request successfully created!`);
    setTimeout(() => {
      updateCurrentTransfer();
    }, 3000);
  };

  const sendTransfer = async () => {
    setLoadingBtn(true);
    setMessage2("Approving transfer request, please wait...");
    await MSW.methods
      .approveTransferRequest(currentTransfer.ID)
      .send({ from: accounts[0] });
    setLoadingBtn(false);
    setMessage2(
      `Transfer request approved ${currentTransfer.approvals} times!`
    );
    await updateBalance();
    await updateCurrentTransfer();
  };

  const updateCurrentTransfer = async () => {
    const currentTransferId = (await MSW.methods.nextID().call()) - 1;
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

  if (!web3) {
    return <div>Loading...</div>;
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
            Contract address: <b>0x4CdFE3d0D4147E43cAdA78eD3fF3900dA49cEC26</b>
            <br />
            Contract balance: <b>{balance} wei</b>
            <br /> <br />
          </p>
        </div>
      </div>
      {!currentTransfer || currentTransfer.approvals === limit ? (
        <div className="row">
          <div className="col-sm-12">
            <h2>Create transfer request</h2>
            <form onSubmit={(e) => createTransfer(e)}>
              <div className="form-group">
                <label htmlFor="amount">
                  <b>Amount:</b>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="amount"
                  placeholder="Enter amount in wei"
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
            Owners:
            {owners &&
              owners.map((owner, index) => {
                return <li key={index}>{owner}</li>;
              })}
            <br />
            <h2>{message}</h2>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-sm-12">
            <h2>Approve transfer request</h2>
            <ul>
              <li>TransferID: {currentTransfer.ID}</li>
              <li>Amount: {currentTransfer.amount} wei</li>
              <li>Beneficiary: {currentTransfer.to}</li>
              <li>
                Approvals: {currentTransfer.approvals} / {limit}
              </li>
            </ul>
            {currentTransfer.alreadyApproved &&
            currentTransfer.approvals === limit ? (
              "Already approved"
            ) : (
              <Button primary loading={loadingBtn} onClick={sendTransfer}>
                Approve
              </Button>
            )}
            <h2>{message2}</h2>
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
        <div style={{ textAlign: "center" }}>&copy; ZrinCin, 2021.</div>
      </footer>
    </div>
  );
};

export default App;
