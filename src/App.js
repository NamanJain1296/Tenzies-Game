import React from "react"
import Confetti from "react-confetti"
import Die from "./Die"

export default function App() {
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rollCount, setRollCount] = React.useState(0)
    const [startTime, setStartTime] = React.useState(null)
    const [endTime, setEndTime] = React.useState(null)
  
    React.useEffect(() => {
        const firstValue = dice[0].value
        const allHeld = dice.every(die => die.held)
        const allSameNumber = dice.every(die => die.value === firstValue)
        if(allHeld && allSameNumber) {
            setTenzies(true)
            setEndTime(Date.now());
        }
    }, [dice])

    /* React.useEffect(() => {
        if(tenzies) {
            setStartTime(Date.now())
            setEndTime(null)
        }
    }, [tenzies]) */
    
    function randomDieValue() {
        return Math.ceil(Math.random() * 6)
    }

    function allNewDice() {
        const newArray = []
        for(let i = 0; i < 10; i++) {
            const newDie = {
                value: randomDieValue(),
                held: false,
                id: i + 1
            }
            newArray.push(newDie)
        }
        return newArray
    }

    function rollUnheldDice() {
        if (!tenzies) {
            setDice((oldDice) => oldDice.map((die, i) =>
                die.held ? 
                    die : 
                    { value: randomDieValue(), held: false, id: i + 1 }
            ))
            setRollCount((prevCount) => prevCount + 1)
        } else {
            setDice(allNewDice())
            setTenzies(false)
            setRollCount(0)
            setEndTime(new Date())
        }
    }

    function holdDice(id) {
        setDice(prevDice => prevDice.map(die => {
            return die.id === id ? 
                {...die, held: !die.held} : 
                die
        }))
    }

    function formatTime(time) {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    

    const diceElements = dice.map((die) => (
        <Die key={die.id} {...die} hold={() => holdDice(die.id)} />
    ))

    return (
        <main>
            {tenzies && <Confetti />}
            <h1>Tenzies</h1>
            <h2>Roll Count: {rollCount}</h2>
            <h2>Elapsed Time: {endTime ? formatTime(endTime - startTime) : '00:00'}</h2>
            <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="die-container">{diceElements}</div>
            <button className="roll-dice" onClick={rollUnheldDice}>
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}
