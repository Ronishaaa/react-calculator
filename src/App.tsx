import { useState } from "react";
import "./App.css";

function App() {
  const [result, setResult] = useState("0");

  const handleClick = (value: string) => {
    setResult(result + value);
  };

  const calculateResult = () => {
    try {
      const match = result.match(/(-?\d+\.?\d*)([+\-*/])(-?\d+\.?\d*)/);

      if (!match) {
        setResult("Error");
        return;
      }

      const a = parseFloat(match[1]);
      const operator = match[2];
      const b = parseFloat(match[3]);

      let answer = 0;

      switch (operator) {
        case "+":
          answer = a + b;
          break;
        case "-":
          answer = a - b;
          break;
        case "*":
          answer = a * b;
          break;
        case "/":
          answer = b !== 0 ? a / b : NaN;
          break;
      }

      setResult(answer.toString());
    } catch {
      setResult("Error");
    }
  };

  return (
    <div>
      calculator
      <div className="">{result}</div>
      <div className="buttons">
        <button onClick={() => handleClick("7")}>7</button>
        <button onClick={() => handleClick("8")}>8</button>
        <button onClick={() => handleClick("9")}>9</button>
        <button onClick={() => handleClick("/")}>/</button>

        <button onClick={() => handleClick("4")}>4</button>
        <button onClick={() => handleClick("5")}>5</button>
        <button onClick={() => handleClick("6")}>6</button>
        <button onClick={() => handleClick("*")}>*</button>

        <button onClick={() => handleClick("1")}>1</button>
        <button onClick={() => handleClick("2")}>2</button>
        <button onClick={() => handleClick("3")}>3</button>
        <button onClick={() => handleClick("-")}>-</button>

        <button onClick={() => handleClick("0")}>0</button>
        <button onClick={() => setResult("0")}>C</button>
        <button onClick={calculateResult}>=</button>
        <button onClick={() => handleClick("+")}>+</button>
      </div>
    </div>
  );
}

export default App;
