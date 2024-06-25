import React, { useState } from 'react';
import './MonopolyMap.css'; // 確保CSS檔案被正確導入
import dice1 from './dice-1.png';
import dice2 from './dice-2.png';
import dice3 from './dice-3.png';
import dice4 from './dice-4.png';
import dice5 from './dice-5.png';
import dice6 from './dice-6.png';

const diceImages = [dice1, dice2, dice3, dice4, dice5, dice6];


const MonopolyMap = () => {
  const [diceValue1, setDiceValue1] = useState(1);  // 初始化第一顆骰子的點數為1
  const [diceValue2, setDiceValue2] = useState(1);
  const rollDice = () => {
    const newDiceValue1 = Math.ceil(Math.random() * 6);  // 生成第一顆骰子1至6之間的隨機數
    const newDiceValue2 = Math.ceil(Math.random() * 6);  // 生成第二顆骰子1至6之間的隨機數
    setDiceValue1(newDiceValue1);  // 更新第一顆骰子的點數
    setDiceValue2(newDiceValue2);  // 更新第二顆骰子的點數
  };
  const createCells = (start, end) => (
    Array.from({ length: end - start + 1 }).map((_, index) => (
      <div className="cell" key={index + start}>{`Cell ${index + start}`}</div>
    ))
  );

  return (
    <div className="monopoly-map">
      <div className="top">{createCells(1, 10)}</div>
      <div className="right">{createCells(11, 20)}</div>
      <div className="bottom">{createCells(21, 30)}</div>
      <div className="left">{createCells(31, 40)}</div>
      <div className="dice-area">
        <img src={diceImages[diceValue1 - 1]} alt={`Dice ${diceValue1}`} className="dice" />
        <img src={diceImages[diceValue2 - 1]} alt={`Dice ${diceValue2}`} className="dice" />
        <button onClick={rollDice} className="roll-button">Roll</button>
      </div>
    </div>
  );
}

export default MonopolyMap;
