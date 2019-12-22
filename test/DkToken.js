const DkToken = artifacts.require('./DkToken.sol');

contract('DkToken', function(accounts) {

    it('initializes the contract with the correct values', function () {
        let instance;
        return DkToken.deployed()
                            .then(i => (instance = i, i.name()))
                            .then(name => (assert.equal(name, 'DkToken', 'sets the name'), instance.symbol()))
                            .then(sym => (assert.equal(sym, 'DKT', 'checks the symbol'), instance.standard()))
                            .then(standard => (assert.equal(standard, "DKT version 1.0", 'checks the standard')));
                            
    })

    it('sets the total supply upon deployment', function () {

        let instance;
        let totalSupply;
        return DkToken.deployed()
                        .then(i => (instance = i, i.totalSupply()))
                        .then(tS => (totalSupply = tS, assert.equal(tS.toNumber(), 1000000, 'sets the total supply on deployment')
                                    , instance.balanceOf(accounts[0])))
                        .then(bal => assert.equal(bal.toNumber(), totalSupply.toNumber(), 'sets the totalsupply to admin'));
    });

    it('Transfer Function tests', function () {

        let instance;

        return DkToken.deployed()
                        .then(i => (instance = i, i.transfer.call(accounts[1], 1000000000)))
                        .then(assert.fail).catch(err => (assert(err.message.indexOf('revert') >= 0, 'Error message must contain revert')
                        , instance.transfer(accounts[1], 25000, { from: accounts[0] })))
                        .then(r => {
                            assert.equal(r.logs.length, 1, 'Should trigger one transfer event');
                            assert.equal(r.logs[0].event, 'Transfer', 'Event should be "Transfer" event');
                            assert.equal(r.logs[0].args._from, accounts[0], 'the balance should be take from admin account');
                            assert.equal(r.logs[0].args._to, accounts[1], 'account where the balance is to be transfered')
                            assert.equal(r.logs[0].args._value, 25000, 'logs the transfer amount');
                            return (r);
                        })
                        .then(r => instance.balanceOf(accounts[1]))
                        .then(bal => (assert.equal(bal, 25000, 'test if transaction works properly'), instance.balanceOf(accounts[0])))
                        .then(bal => (assert.equal(bal, 1000000 - 25000, 'check the balance of each account')));
    })

    it('Approve Function tests', function () {
        let instance;

        return DkToken.deployed()
                        .then(i => (instance = i, i.approve.call(accounts[1], 100)))
                        .then(s => (assert.equal(s, true, 'should return true when function sucessfully completes'), instance.approve(accounts[1], 100)))
                        .then(r => {
                            assert.equal(r.logs.length, 1, 'Should trigger one approve event');
                            assert.equal(r.logs[0].event, 'Approval', 'Event should be "Approve" event');
                            assert.equal(r.logs[0].args._owner, accounts[0], 'the balance should be take from admin account');
                            assert.equal(r.logs[0].args._spender, accounts[1], 'account where the balance is to be transfered')
                            assert.equal(r.logs[0].args._value, 100, 'logs the transfer amount');
                            return (instance.allowance(accounts[0], accounts[1]));
                        })
                        .then(a => (assert.equal(a.toNumber(), 100, 'Allowance for transfer')))
    });
});