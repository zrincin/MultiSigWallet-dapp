import { useState } from "react";
import web3 from "../web3";
import { Button } from "semantic-ui-react";
import styles from "../../styles/TransferList.module.css";

const TransferList = ({ transfers, approveTransfer, loadingBtn }) => {
  const [showTransfers, setShowTransfers] = useState(false);

  return (
    <>
      <Button
        color="olive"
        size="tiny"
        compact
        onClick={() => setShowTransfers(!showTransfers)}
        style={{ marginBottom: 20 }}
      >
        {showTransfers ? "Hide transfer list" : "Show transfer list"}
      </Button>
      {showTransfers && (
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
                  <td className={transfer.isSent ? styles.sent : ""}>
                    {transfer.isSent ? "yes" : "no"}
                  </td>
                  <button
                    className={styles.approveBtn}
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
      )}
    </>
  );
};

export default TransferList;
