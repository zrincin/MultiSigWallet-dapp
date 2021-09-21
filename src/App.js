import React, { useState, useEffect } from 'react';
import web3 from './web3';
import MSW from './MSW';

var array = ["0x39e0359F659581CF326b8D324745DA64695C0ef3", "0x06E954198e10F8A86bBB7101e43f46D3998Cedbf", "0x79Fc51e9f9634119528755463942c6E42B618660"]

function App() {
  const [accounts, setAccounts] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [currentTransfer, setCurrentTransfer] = useState(undefined);
  const [limit, setlimit] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const accounts = await web3.eth.getAccounts();
      const limit = await MSW.methods
        .limit()
        .call();

      setAccounts(accounts);
      setlimit(limit);
      updateBalance();
      
    }
    init();
    window.ethereum.on('accountsChanged', accounts => {
      setAccounts(accounts);
    });
  }, []);

  async function updateBalance() {
    const balance = await web3.eth.getBalance(MSW.options.address);
    setBalance(balance);
  }

  async function createTransfer(e) {
    e.preventDefault();
    const amount = e.target.elements[0].value;
    const to = e.target.elements[1].value;
    await MSW.methods
      .createTransferRequest(amount, to)
      .send({from: accounts[0]});
    await updateCurrentTransfer();
  };

  async function sendTransfer() {
    await MSW.methods
      .approveTransferRequest(currentTransfer.ID)
      .send({from: accounts[0]});
    await updateBalance();
    await updateCurrentTransfer();
  };

  async function updateCurrentTransfer() {
    const currentTransferId = (await MSW.methods
      .nextID()
      .call()) - 1;
    if(currentTransferId >= 0) {
      const currentTransfer = await MSW.methods
        .transfers(currentTransferId)
        .call();
      const alreadyApproved = await MSW.methods
        .isApproved(accounts[0], currentTransferId)
        .call();
      setCurrentTransfer({...currentTransfer, alreadyApproved});
    }
  }

  if (!web3) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="text-center">Multi Signature Wallet</h1>
      <h2 className="text-center">(required signatures: {limit})</h2>
      <br/>
      <div className="row">
        <div className="col-sm-12">
           <p>Contract balance: <b>{balance} wei</b> </p>
        </div>
      </div>
      {!currentTransfer || currentTransfer.approvals === limit ? ( 
        <div className="row">
          <div className="col-sm-12">
            <h2>Create transfer</h2>
            <form onSubmit={e => createTransfer(e)}>
              <div className="form-group">
                <label htmlFor="amount"><b>Amount:</b></label>
                <input type="number" className="form-control" id="amount" placeholder="Enter amount in wei" />
              </div>
              <div className="form-group">
                <label htmlFor="to"><b>To:</b></label>
                <input type="text" className="form-control" id="to" placeholder="Enter address of beneficiary"/>
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <br/>
            Owners: {!Object.values(web3.eth.getAccounts()).map(acc => <li>{acc}</li>) || array.map(a => <li>{a}</li>) }
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-sm-12">
            <h2>Approve transfer</h2>
            <ul>
              <li>TransferID: {currentTransfer.ID}</li>
              <li>Amount: {currentTransfer.amount} wei</li>
              <li>Beneficiary: {currentTransfer.to}</li>
              <li>Approvals: {currentTransfer.approvals} / {limit}</li>
            </ul>
            {currentTransfer.alreadyApproved && currentTransfer.approvals === limit ? 'Already approved' : (
              <button 
                type="submit" 
                className="btn btn-primary"
                onClick={sendTransfer}
              >Submit</button>
            )}
          </div>
        </div>
      )}
       <footer>
         <br/> <br/> <br/> <br/> <br/>
         <div style={{textAlign: "center", backgroundColor: "#ECF0F1"}}>&copy; ZrinCin, 2021.</div>
      </footer>
    </div>
  );
}

export default App;