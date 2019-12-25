App = {
    loading: false,
    web3Provider: null,
    tokenPrice: 1000000000000000,
    tokenSold : 0,
    tokenAvailable: 750000,
    init : function() {
        console.log("App initialized.....");
        return App.initWeb3();
    },
    contracts: {
        DkTokenSale: null,
        DkToken: null
    },
    initWeb3: function() {
        if (typeof web3 !== 'undefined')
        {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        }
        else
        {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContracts();
    },
    initContracts : function () {
        $.getJSON('DkTokenSale.json', function(DkTokenSale) {
            App.contracts.DkTokenSale = TruffleContract(DkTokenSale);
            App.contracts.DkTokenSale.setProvider(App.web3Provider);
            App.contracts.DkTokenSale.deployed().then((s) => console.log("DkTokenSale Address: ", s.address));
        }).done(() => {
            $.getJSON('DkToken.json', function(DkToken) {
                App.contracts.DkToken = TruffleContract(DkToken);
                App.contracts.DkToken.setProvider(App.web3Provider);
                App.contracts.DkToken.deployed().then((s) => console.log("DkToken Address :", s.address));
            }).done(() => {
                App.listenForEvents();
                App.render();
            })
        })
    },

    render: function() {
        if (App.loading) {
            return ;
        }

        App.loading = true;

        let loader = $('#loader');
        let content = $('#content');
        let SaleInstance;

        loader.show();
        content.hide();

        web3.eth.getCoinbase(function(err, account) { 
            if (!err)
            {
                App.account = account;
                $('#accountAddress').html("Your Account : " + App.account);
            }
        });

        App.contracts.DkTokenSale.deployed()
                                    .then(i => (SaleInstance = i, i.tokenPrice()))
                                    .then(tp => {
                                        App.tokenPrice = tp.toNumber();
                                        $('.token-price').html(web3.fromWei(App.tokenPrice,"ether"));
                                    })
                                    .then(() => SaleInstance.tokenSold())
                                    .then(ts => {
                                        App.tokenSold = ts.toNumber();
                                        $('.token-sold').html(App.tokenSold);
                                        $('.tokens-available').html(App.tokenAvailable);
                                        let progressPercent = Math.ceil((App.tokenSold / App.tokenAvailable) * 100);
                                        $('#progess').width(progressPercent + "%");
                                    })
        App.contracts.DkToken.deployed()
                                .then(i => (TokenInstance = i, i))
                                .then(i => i.balanceOf(App.account))
                                .then(bal => $('.dapp-balance').html(bal.toNumber()))
                                .then(() => {
                                    App.loading = false;
                                    loader.hide();
                                    content.show();
                                })
    },

    buyTokens : function () {
        let content = $('#content');
        let loader = $('#loader');
        let SaleInstance;

        content.hide();
        loader.show();

        let val = $("#numberOfToken").val();
        App.contracts.DkTokenSale.deployed()
                                    .then(i => (SaleInstance = i, i))
                                    .then(i => i.buyToken(val, {
                                        from: App.account,
                                        value: val * App.tokenPrice,
                                        gas: 500000
                                    }))
                                    .then(r => {
                                        console.log('Tokens bought....', r);
                                        $('form').trigger('reset');
                                    })
                                    .catch(e => console.log(e));
    },

    listenForEvents: function() {
        App.contracts.DkTokenSale.deployed()
                                    .then(i => {
                                        i.Sell({}, {
                                        fromBlock: 0,
                                        toBlock: 'latest'
                                    }).watch((err, event) => {
                                        console.log('event triggered', event);
                                        App.render();
                                    });
                                })
    }
};

$(function() {
    $(window).on('load', function() {
        App.init();

    })
})