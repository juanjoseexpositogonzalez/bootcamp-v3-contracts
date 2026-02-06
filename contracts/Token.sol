// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

contract Token {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed from, address indexed to, uint256 value);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        // 0. Require caller's account balance to be greater than or equal to _value
        require(balanceOf[msg.sender] >= _value, "Token: Insufficient Funds");

        _transfer(msg.sender, _to, _value);
        
        // 3. Emit Transfer Event
        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal {

        require(_to != address(0), "Token: Recipient is address 0");
        // 1. Deduct tokens from sender
        balanceOf[_from] -= _value;

        // 2. Credit tokens to recipient
        balanceOf[_to] += _value;
    }

    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        // require(balanceOf[msg.sender] >= _value, "Token: Insufficient Funds");
        require(_spender != address(0), "Token: Recipient is address 0");
        
        // 1. Update allowance of _spender
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);
        
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {

        require(_value <= balanceOf[_from], "Token: Insufficient Funds");
        require(
            _value <= allowance[_from][msg.sender],
            "Token: Insufficient Allowance");

        // Reset allowance
        allowance[_from][msg.sender] -= _value;

        _transfer(_from, _to, _value);

        emit Transfer(_from, _to, _value);

        return true;
     }
}
