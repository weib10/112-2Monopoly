// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MonopolyGame {
    mapping(address => uint256) public playerPositions;
    address[4] public players;  // 先設定四個玩家
    uint256 private nonce = 0;

    // 事件
    event PlayerMoved(address player, uint256 newPosition);

    // 初始化玩家
    function initializePlayers(address[4] memory _players) public {
        for (uint i = 0; i < _players.length; i++) {
            players[i] = _players[i];
            playerPositions[_players[i]] = 0; // 所有玩家起始位置為0
        }
    }

    // 擲骰子，返回一個1到6之間的數字
    function rollDice() public returns (uint256) {
        require(isPlayer(msg.sender), "Only a registered player can roll the dice.");
        uint256 dice = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % 6 + 1;
        nonce++;
        return dice;
    }

    // 檢查是否為註冊玩家
    function isPlayer(address _address) private view returns (bool) {
        for (uint i = 0; i < players.length; i++) {
            if (players[i] == _address) {
                return true;
            }
        }
        return false;
    }

    // 根據擲骰子的結果移動玩家
    function movePlayer() public {
        uint256 diceResult = rollDice();
        playerPositions[msg.sender] = (playerPositions[msg.sender] + diceResult) % 40; // 假設棋盤有40個位置
        emit PlayerMoved(msg.sender, playerPositions[msg.sender]);
    }
}
