pragma solidity >=0.4.2;
// Contract compliant with ERC20
contract DkToken {

    string public name = "DkToken";
    string public symbol = "DKT";
    string public standard = "DKT version 1.0";

    // Total Supply of Token
    uint256 public totalSupply;

    // Mapping of balance of each user
    mapping(address => uint256) public balanceOf;

    // Mapping of allowance for each user
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256         _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256         _value
    );

    constructor(uint256 _initialSupply) public {
        totalSupply = _initialSupply;
        // allocate initial supply to us
        balanceOf[msg.sender] = _initialSupply;
    }

    // Function to trnasfer tokens
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "value of transfer exceeds the balance in the account");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        // Trigger a transfer event
        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        
        allowance [msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return (true);
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }
}