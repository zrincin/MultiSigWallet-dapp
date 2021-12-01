const MSW = artifacts.require("MultiSigWallet.sol");

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(MSW, [accounts[0], accounts[1], accounts[2]], 3);
  const wallet = await MSW.deployed();
  web3.eth.sendTransaction({
    from: accounts[1],
    to: wallet.address,
    value: 1000000000000000000, // 1 ether
  });
};
