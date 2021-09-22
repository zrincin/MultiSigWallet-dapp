const MSW = artifacts.require('MultiSigWallet.sol');

module.exports = (deployer, network, accounts) => {
    deployer.deploy(MSW, [accounts[0], accounts[1], accounts[2]], 3, {from: accounts[0]})
};