import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { loadContract } from "./utils/load-contract";

function MonopolyGame() {
    const [web3Api, setWeb3Api] = useState(null);
    const [contract, setContract] = useState(null);
    const [positions, setPositions] = useState({});

    useEffect(() => {
        const init = async () => {
          if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
              const accounts = await web3.eth.requestAccounts();
              const MonopolyGameContract = await loadContract("MonopolyGame", web3);
              setWeb3Api(web3);
              setContract(MonopolyGameContract);
            } catch (error) {
              console.error("Error in loading contract:", error);
            }
          } else {
            console.error("No MetaMask extension detected!");
            alert("Please install MetaMask extension!");
          }
        };
        init();
    }, []);

    useEffect(() => {
        if (contract) {
            console.log("Contract is loaded", contract);
            console.log("Contract events:", contract.events);
            if (contract.events && contract.events.PlayerMoved) {
                const eventListener = contract.events.PlayerMoved({
                    fromBlock: 'latest'
                }).on('data', function(event) {
                    const { player, newPosition } = event.returnValues;
                    setPositions(prev => ({ ...prev, [player]: newPosition }));
                }).on('error', console.error);

                return () => eventListener.unsubscribe();
            } else {
                console.error("Event PlayerMoved is not available on the contract.");
            }
        }
    }, [contract]);

    return (
        <div>
            <h1>Monopoly Game Positions</h1>
            {Object.entries(positions).map(([player, position]) => (
                <p key={player}>Player {player}: Position {position}</p>
            ))}
        </div>
    );
}

export default MonopolyGame;
