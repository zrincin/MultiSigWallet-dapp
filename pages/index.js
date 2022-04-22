import { useState, useEffect } from "react";
import ConnectWallet from "../src/components/ConnectWallet";
import TransferList from "../src/components/TransferList";
import CreateTransaction from "../src/components/CreateTransaction";
import ApproveTransaction from "../src/components/ApproveTransaction";
import Footer from "../src/components/Footer";
import web3 from "../src/web3";
import MSW from "../src/MSW";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "animate.css";
import { shortenAddress } from "../src/utils/addressShortener";
import Head from "next/head";

const App = ({ data }) => {
  const [accounts, setAccounts] = useState(null);
  const [balance, setBalance] = useState(data.balance);
  const [currentTransfer, setCurrentTransfer] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [message, setMessage] = useState("");
  const [value, setValue] = useState({ amount: "", to: "" });

  useEffect(() => {
    const init = async () => {
      const accounts = await web3.eth.getAccounts();
      const transfers = await MSW.methods.getTransfers().call();

      setAccounts(accounts);
      setTransfers(transfers);
    };
    init();
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccounts(accounts);
      });
      window.ethereum.on("chainChanged", (_) => window.location.reload());
    }
  }, []);

  const updateBalance = async () => {
    const balance = await web3.eth.getBalance(MSW.options.address);
    setBalance(balance);
  };

  const createTransfer = async (e) => {
    e.preventDefault();
    setLoadingBtn(true);
    setMessage("Creating new transfer request, please wait...");

    const inputValidation =
      e.target.elements[0].value === "" || e.target.elements[1].value === "";

    if (inputValidation) {
      alert("Error: empty field(s). Please enter required information!");
    }

    try {
      const amount = e.target.elements[0].value;
      const to = e.target.elements[1].value;
      await MSW.methods
        .createTransferRequest(web3.utils.toWei(amount, "ether"), to)
        .send({ from: accounts[0] });
      setMessage("Transfer request successfully created!");
      setTimeout(() => setMessage(""), 3000);
      await updateCurrentTransfer();
    } catch (err) {
      console.error(err);
      setMessage(inputValidation ? "" : "Transaction canceled!");
      setValue({ amount: "", to: "" });
      setTimeout(() => setMessage(""), 3000);

      setLoadingBtn(false);
    }
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
      await updateCurrentTransfer();
      await updateBalance();
    } catch (err) {
      console.error(err);
      setMessage("Transaction canceled!");
      setTimeout(() => setMessage(""), 3000);
    }

    setLoadingBtn(false);
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

  return (
    <>
      <Head>
        <title>MultiSig Wallet dApp</title>
      </Head>
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
            <h3 style={{ marginTop: -10 }}>
              (required signatures: {data.limit})
            </h3>
          </div>

          <ConnectWallet accounts={accounts} shortenAddress={shortenAddress} />
          <>
            <p>
              Contract address: <b>{MSW.options.address} &nbsp; (Rinkeby)</b>
              <br />
              Contract balance:
              <b>
                {balance} wei &nbsp;&nbsp;(
                {web3.utils.fromWei(balance, "ether")} ETH)
              </b>
            </p>
          </>

          {!currentTransfer || currentTransfer.approvals === data.limit ? (
            <>
              <h2>Create transfer request</h2>

              <CreateTransaction
                createTransfer={createTransfer}
                value={value}
                setValue={setValue}
                loadingBtn={loadingBtn}
              />

              <br />
              <h4>Owners:</h4>
              {data.owners &&
                data.owners.map((owner, index) => {
                  return <li key={index}>{owner}</li>;
                })}
              <br />
              <h2>{message}</h2>

              <TransferList
                transfers={transfers}
                approveTransfer={approveTransfer}
                loadingBtn={setLoadingBtn}
              />
            </>
          ) : (
            <>
              <ApproveTransaction
                limit={data.limit}
                loadingBtn={loadingBtn}
                currentTransfer={currentTransfer}
                approveTransfer={approveTransfer}
              />
              <h2>{message}</h2>
            </>
          )}
        </Container>
        <Footer />
      </div>
    </>
  );
};

export default App;

App.getInitialProps = async () => {
  const balance = await web3.eth.getBalance(MSW.options.address);
  const limit = await MSW.methods.limit().call();
  const owners = await MSW.methods.getOwners().call();

  const data = {
    balance,
    limit,
    owners,
  };

  return {
    data,
  };
};
