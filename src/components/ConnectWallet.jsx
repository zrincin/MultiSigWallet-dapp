import { Button } from "semantic-ui-react";
import Link from "next/link";

const ConnectWallet = ({ accounts, shortenAddress }) => {
  const hasEthereum =
    typeof window !== "undefined" && typeof window.ethereum !== "undefined";

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
            await window.ethereum?.request({
              method: "eth_requestAccounts",
            });
          }}
        >
          {hasEthereum ? (
            "Connect Wallet"
          ) : (
            <Link href="https://metamask.io">
              <a style={{ color: "white" }} target="_blank">
                Install Metamask
              </a>
            </Link>
          )}
        </Button>
      )}
      <br /> <br />
    </>
  );
};

export default ConnectWallet;
