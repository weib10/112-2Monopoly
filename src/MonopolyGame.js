import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { loadContract } from './utils/load-contract';
import { paste } from '@testing-library/user-event/dist/paste';

function MonopolyGame() {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [positions, setPositions] = useState({});
    const [account, setAccount] = useState(null);
    const [diceResult, setDiceResult] = useState(null);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    const accounts = await web3Instance.eth.requestAccounts();
                    const accountToLarge = Web3.utils.toChecksumAddress(accounts[0]);
                    const monopolyGameContract = await loadContract('MonopolyGame', web3Instance);
                    setWeb3(web3Instance);
                    setAccount(accountToLarge);
                    setContract(monopolyGameContract);
                    console.log('Contract loaded:', monopolyGameContract);

                    // 获取过去的事件
                    const pastEvents = await monopolyGameContract.getPastEvents('DiceRolled', {
                        filter: { player: accountToLarge },
                        fromBlock: 0,
                        toBlock: 'latest'
                    });
                    console.log("pastevent:", pastEvents);
                    if (pastEvents.length > 0) {
                        const lastEvent = pastEvents[pastEvents.length - 1];
                        const diceValue = lastEvent.returnValues.diceResult;
                        setDiceResult(diceValue);
                    }
                } catch (error) {
                    console.error('Error in loading contract or fetching past events:', error);
                }
            } else {
                console.error('No MetaMask extension detected!');
                alert('Please install MetaMask extension!');
            }
        };
        init();
    }, []);

    const rollDice = async () => {
        if (contract && account) {
            try {
                await contract.methods.rollDice().send({ from: account });

                // 获取最新的事件
                const pastEvents = await contract.getPastEvents('DiceRolled', {
                    filter: { player: account },
                    fromBlock: 'latest'
                });
                console.log("pastEvent:", pastEvents);

                if (pastEvents.length > 0) {
                    const lastEvent = pastEvents[pastEvents.length - 1];
                    const diceValue = lastEvent.returnValues.diceResult;
                    setDiceResult(diceValue);
                }
            } catch (error) {
                console.error('Error rolling dice:', error);
                alert('Error rolling dice: ' + error.message);
            }
        } else {
            alert('Please connect to MetaMask and select an account.');
        }
    };

    const movePlayer = async () => {
        if (contract && account) {
            try {
                await contract.methods.movePlayer().send({ from: account });
                const newPosition = await contract.methods.playerPositions(account).call();
                setPositions(prevPositions => ({ ...prevPositions, [account]: newPosition }));
            } catch (error) {
                console.error('Error moving player:', error);
                alert('Error moving player: ' + error.message);
            }
        }
    };

    return (
        <div>
            <h1>Monopoly Game</h1>
            <button onClick={rollDice}>Roll Dice</button>
            <button onClick={movePlayer}>Move Player</button>
            {diceResult !== null && <p>Dice Result: {diceResult}</p>}
            <h2>Player Positions</h2>
            <ul>
                {Object.keys(positions).map((player, index) => (
                    <li key={index}>{player}: {positions[player]}</li>
                ))}
            </ul>
        </div>
    );
}

export default MonopolyGame;
