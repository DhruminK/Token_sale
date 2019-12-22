pragma solidity >=0.4.2;

import "./DkToken.sol";

contract DkTokenSale {

    // User who deployed the contract
    address admin;
    DkToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokenSold;

    event Sell(
        address indexed _buyer,
        uint256         _amount
    );

    constructor (DkToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function mult(uint x, uint y) internal pure returns (uint z){
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyToken(uint256 _numberOfTokens) public payable {
        require(msg.value == mult(_numberOfTokens, tokenPrice), "Ether provided not enough for number of tokens");
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, "Number of tokens exceeds the maximum limit");
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokenSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }

}