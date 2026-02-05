// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

contract Token {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

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
        require(_to != address(0), "Token: Recipient is address 0");

        // 1. Deduct tokens from sender
        balanceOf[msg.sender] -= _value;

        // 2. Credit tokens to recipient
        balanceOf[_to] += _value;

        // 3. Emit Transfer Event
        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}
