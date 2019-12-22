const DkToken = artifacts.require('./DkToken.sol');
const DkTokenSale = artifacts.require('./DkTokenSale.sol');

module.exports = function (deployer) {
    deployer.deploy(DkToken, 1000000)
                .then(() => deployer.deploy(DkTokenSale, DkToken.address, 1000000000000000));
};