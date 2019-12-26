# Token Sale

This repository is a very basic demonstration of Token Sale using ERC20 Token.

# Features!

* Creates Token using Smart-Contracts which ERC20 compliant
* Smart-Contracts to mimic Token Sale

### Dependencies

* [Ganuche] - Blockchain simulator for Ethereum development
* [Metamask] - Brings Ethereum wallet to browser without downloading full node

### Tech

Token Sale uses technologies like

* [Node.js] - Because this is one of the use case of Node.js
* [Bootstrap] - For better UI
* [Truffle] - To Compile and manage smart-contracts
* [Jquery] - Dependency of bootstrap
### Installation
Token Sale project depends on Ganuche Application or other alternatives that is a blockchain simulator for Ethereum development

Install the dependencies and devDependencies
```sh
$ cd token_sale
$ npm install
```

Transfer Tokens to TokenSale contract
```sh
$ npx truffle console
> let admin;
> let tokenAvailable = 750000;
> let SaleInstance;
> let TokenInstance;
> web3.eth.getAccounts().then(acc => (admin = acc[0]);
> DkToken.deployed().then(i => TokenInstance = i);
> DkTokenSale.deployed().then(i => SaleInstance = i);
> TokenInstance.transfer(SaleInstance.address, tokenAvailable, { from : admin });
> .exit
```

Now that all the dependencies all installed and token is transfered we can run our web server using
```sh
$ npm run dev
```

Open URL http://localhost:3000 to start interacting with the application

MIT License



[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [Node.js]: <https://nodejs.org/>
   [Express.js]: <https://expressjs.com/>
   [socket.io]: <https://socket.io/>
   [AngularJS]: <https://angular.io/>
   [Bootstrap]: <https://v4-alpha.getbootstrap.com/>
   [JsonWebToken]: <https://www.npmjs.com/package/jsonwebtoken/>
   [Hashids]: <https://www.npmjs.com/package/hashids/>
   [lodash]: <https://lodash.com/>
   [mongoose]: <http://mongoosejs.com/>
   [passport]: <http://passportjs.org/>
   [Typescript]: <https://www.typescriptlang.org/>
   [webpack]: <https://webpack.github.io/>
   [nodemon]: <https://nodemon.io/>
   [bcrypt-nodejs]: <https://www.npmjs.com/package/bcrypt-nodejs>
   [jquery]: <https://jquery.com/>
   [truffle]: <https://www.trufflesuite.com/docs/truffle/overview>
   [ganuche]: <https://www.trufflesuite.com/docs/ganache/overview>
   [Metamask]: <https://metamask.io/>
