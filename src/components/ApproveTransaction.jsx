import web3 from "../web3";
import { Button } from "semantic-ui-react";

const ApproveTransaction = ({
  limit,
  loadingBtn,
  currentTransfer,
  approveTransfer,
}) => {
  return (
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
    </>
  );
};

export default ApproveTransaction;
