const DkTokenSale = artifacts.require('./DkTokenSale.sol');
const DkToken = artifacts.require('./DkToken.sol');

contract('DkTokenSale', function (accounts) {

    let tokenPrice = 1000000000000000;      // in wei
    let buyer = accounts[1];
    let admin = accounts[0];

    it('initializes contract with correct value', function () {
        let instance;

        return DkTokenSale.deployed()
                            .then(i => (instance = i, i.address))
                            .then(addr => (assert.notEqual(addr, 0x0, 'should have contract address'), instance.tokenContract()))
                            .then(addr => (assert.notEqual(addr, 0x0, 'should have a token contract address')))
                            .then(() => instance.tokenPrice())
                            .then(price => assert.equal(price.toNumber(), tokenPrice, 'token price of contract'));
    });

    it('Buying token function tests', function () {
        let instance;
        let tinstance;
        let numberOfTokens = 10;
        let value = numberOfTokens * tokenPrice;
        let tokenAvailable = 750000;


        return DkToken.deployed()
                        .then(i => (tinstance = i))
                        .then(() => DkTokenSale.deployed())
                        .then(i => (instance = i, tinstance.transfer(instance.address, tokenAvailable, { from : admin })))
                        .then(() => (instance.buyToken(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice})))
                        .then(r => {
                            assert.equal(r.logs.length, 1, 'triggers Sell event');
                            assert.equal(r.logs[0].event, 'Sell', 'should be the "Sell" event');
                            assert.equal(r.logs[0].args._buyer, buyer, 'the account purchasing the token should be of buyer');
                            assert.equal(r.logs[0].args._amount, numberOfTokens, 'logs the number of token purchased');
                        })
                        .then(() => instance.tokenSold())
                        .then(amt => (assert.equal(amt.toNumber(), numberOfTokens, 'Number of tokens are same as number of token sold')))
                        .then(() => (tinstance.balanceOf(instance.address)))
                        .then(bal => assert.equal(bal.toNumber(), tokenAvailable - numberOfTokens, 'Check if number of tokens are transfered in DkToken contract'))
                        .then(() => instance.buyToken(numberOfTokens, { from: buyer, value: 1}))
                        .then(assert.fail)
                        .then(err => assert(err.message.indexOf('revert') >= 0, 'Value of tokens given should be equal to actual value'))
                        .then(() => instance.buyToken(tokenAvailable + 1000, { from: buyer, value: (tokenAvailable + 1000) * tokenPrice}))
                        .then(assert.fail)
                        .catch(err => (assert(err.message.indexOf('revert') >= 0, 'number of tokens should be less that tokens available')))

    });
})