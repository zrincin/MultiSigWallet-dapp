const MSW = artifacts.require('MultiSigWallet.sol');

module.exports = (deployer, network, accounts) => {
    deployer.deploy(MSW, [accounts[1], accounts[2], accounts[3]], 3, {from: accounts[0]})
};