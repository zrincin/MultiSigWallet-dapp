import Web3 from "web3";
const api = require("./secrets.json");

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and Metamask is running
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server OR the user is not running Metamask
  const provider = new Web3.providers.HttpProvider(
    `https://speedy-nodes-nyc.moralis.io/${api.API_KEY}/eth/rinkeby`
  );
  web3 = new Web3(provider);
}

export default web3;
