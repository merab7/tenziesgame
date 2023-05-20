import{useEffect, useState} from "react";
import Die from "./Die.jsx";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [rollCount, setRollCount] = useState(0);
  const [personalRecord, setPersonalRecord] = useState(
    parseInt(localStorage.getItem("personalRecord")) || 0
  );
  const[windowSize, setWindowSize]= useState({
    width:undefined,
    height:undefined,
  })

  function handelWindowSize(){
    setWindowSize({
      width:window.innerWidth,
      height:window.innerHeight,
    })

  }

  useEffect(() => {
    window.onresize=()=>handelWindowSize();
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      if (rollCount < personalRecord || personalRecord === 0) {
        setPersonalRecord(rollCount);
        localStorage.setItem("personalRecord", rollCount);
      }
    }
  }, [dice, rollCount, personalRecord]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setRollCount((prevCount) => prevCount + 1);
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setRollCount(0);
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  function startNewGame() {
    setTenzies(false);
    setDice(allNewDice());
    setRollCount(0);
    localStorage.removeItem("rollCount");
  }

  return (
    <main>
      {tenzies && <  Confetti width={windowSize.width} height={windowSize.height} />}
      <div className="titlediv" >
      <h1 className="title">{tenzies? "You won ! 🏆":"Tenzies"}</h1>
      </div>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
      </div>
      <div className="prrrdiv" >
      <p>Roll Count: {rollCount}</p>
      <p>Personal Record: {personalRecord}</p>
      </div>
    </main>
  );
}
