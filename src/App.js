import React, { useState, useEffect } from "react";
import TransferList from "./components/TransferList";
import Footer from "./components/Footer";
import web3 from "./web3";
import MSW from "./MSW";
import { Container, Form, Input, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "animate.css";
import { shortenAddress } from "./utils/addressShortener";

const App = () => {
  const [accounts, setAccounts] = useState(null);
  const [balance, setBalance] = useState("");
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
    };
    init();
    window.ethereum.on("accountsChanged", (accounts) => {
      setAccounts(accounts);
    });
    window.ethereum.on("chainChanged", (_) => window.location.reload());
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

  if (!web3 || accounts == null || owners.length === 0) {
    return (
      <>
        <h1>Loading...</h1>
        <h3> (If no content - switch network to Rinkeby)</h3>
      </>
    );
  }

  return (
    <div
      style={{ overflow: "auto", animationDuration: "2s" }}
      className="animate__fadeInDown"
    >
      <Container>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <h1>Multi Signature Wallet</h1>
          <h3 style={{ marginTop: -10 }}>(required signatures: {limit})</h3>
        </div>
        {accounts && accounts.length ? (
          <div style={{ float: "right" }}>
            <b>Connected to:</b> &nbsp;
            <span style={{ color: "#3336FF", fontWeight: "bolder" }}>
              {accounts && shortenAddress(accounts[0])}
            </span>
          </div>
        ) : (
          <Button
            circular
            color="vk"
            size="small"
            floated="right"
            onClick={async () => {
              await window.ethereum.request({
                method: "eth_requestAccounts",
              });
            }}
          >
            Connect Wallet
          </Button>
        )}
        <br /> <br />
        <>
          <p>
            Contract address: <b>{MSW.options.address} &nbsp; (Rinkeby)</b>
            <br />
            Contract balance:{" "}
            <b>
              {balance} wei &nbsp;&nbsp;(
              {web3.utils.fromWei(balance, "ether")} ETH)
            </b>
          </p>
        </>
        {!currentTransfer || currentTransfer.approvals === limit ? (
          // CREATE TRANSFER
          <>
            <h2>Create transfer request</h2>

            <Form onSubmit={createTransfer}>
              <Form.Field>
                <label htmlFor="amount">
                  <b>Amount [ETH]:</b>
                </label>
                <Input
                  type="number"
                  id="amount"
                  placeholder="Enter amount in ether"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor="to">
                  <b>To:</b>
                </label>
                <Input
                  type="text"
                  id="to"
                  placeholder="Enter address of beneficiary"
                />
              </Form.Field>
              <Button primary loading={loadingBtn}>
                Create
              </Button>
            </Form>

            <br />
            <h4>Owners:</h4>
            {owners &&
              owners.map((owner, index) => {
                return <li key={index}>{owner}</li>;
              })}
            <br />
            <h2>{message}</h2>

            <Button
              color="olive"
              size="tiny"
              compact
              onClick={() => setShowTransfers(!showTransfers)}
              style={{ marginBottom: 20 }}
            >
              {showTransfers ? "Hide transfer list" : "Show transfer list"}
            </Button>

            {showTransfers ? (
              <TransferList
                transfers={transfers}
                approveTransfer={approveTransfer}
              />
            ) : null}
          </>
        ) : (
          //APPROVE TRANSFER
          <>
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
          </>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default App;
