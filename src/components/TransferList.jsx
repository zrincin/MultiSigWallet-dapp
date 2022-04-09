import React from "react";
import web3 from "../web3";
import "./TransferList.css";

const TransferList = ({ transfers, approveTransfer, loadingBtn }) => {
  return (
    <div style={{ marginBottom: 50 }}>
      <h4>Transfers:</h4>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount [ETH] &nbsp;&nbsp;</th>
            <th>Beneficiary</th>
            <th>Approvals &nbsp;&nbsp; </th>
            <th>Sent </th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((transfer) => (
            <tr key={transfer.ID}>
              <td>{transfer.ID} &nbsp;&nbsp;&nbsp;</td>
              <td>
                {web3.utils.fromWei(transfer.amount, "ether")}
                &nbsp;&nbsp;&nbsp;
              </td>
              <td>{transfer.to} &nbsp;&nbsp;&nbsp;</td>
              <td style={{ textAlign: "center" }}>
                {transfer.approvals} &nbsp;&nbsp;&nbsp;
              </td>
              <td className={`${transfer.isSent ? "sent" : ""}`}>
                {transfer.isSent ? "yes" : "no"}
              </td>
              <button
                className={`${!transfer.isSent ? "approve-btn" : "hide-btn"}`}
                style={{ marginLeft: 20 }}
                onClick={() => {
                  approveTransfer(transfer.ID);
                  loadingBtn(false);
                }}
              >
                Approve
              </button>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransferList;
