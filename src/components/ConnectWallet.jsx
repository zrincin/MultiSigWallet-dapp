import React from "react";
import { Button } from "semantic-ui-react";

const ConnectWallet = ({ accounts, shortenAddress }) => {
  return (
    <>
      {accounts && accounts.length ? (
        <div
          style={{
            float: "right",
          }}
        >
          <b>Connected to:</b> &nbsp;
          <span
            style={{
              color: "#3336FF",
              fontWeight: "bolder",
            }}
          >
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
    </>
  );
};

export default ConnectWallet;
