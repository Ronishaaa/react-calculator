import { useState } from "react";
import "./App.css";

function App() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [showExpression, setShowExpression] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);

  // Helper function to format numbers to 7 chars
  const formatTo7Chars = (value: string): string => {
    // Remove any whitespace
    const str = value.replace(/\s+/g, "");

    // If it's a number with decimal, limit to 7 chars including decimal point
    if (str.includes(".") && str.length > 7) {
      // For decimal numbers, preserve at least 1 digit after decimal if possible
      const [integer, decimal] = str.split(".");
      const maxIntegerLength = Math.min(6, integer.length);
      const maxDecimalLength = 7 - maxIntegerLength - 1; // -1 for decimal point

      if (maxDecimalLength > 0) {
        return (
          integer.slice(0, maxIntegerLength) +
          "." +
          decimal.slice(0, maxDecimalLength)
        );
      } else {
        return integer.slice(0, 7);
      }
    }

    // For integers, just take first 7 chars
    return str.slice(0, 7);
  };

  const handleClick = (value: string) => {
    if (result === "Error" || result === "Infinity" || result === "NaN") {
      const newResult = formatTo7Chars(value);
      setResult(newResult);
      setExpression("");
      setIsOverflow(newResult.length >= 7);
      return;
    }

    if (result === "0" && value !== ".") {
      setResult(value);
      setIsOverflow(value.length >= 7);
    } else {
      const newResult = result === "0" ? value : result + value;
      const formattedResult = formatTo7Chars(newResult);
      setResult(formattedResult);
      setIsOverflow(newResult.length > 7);
    }
  };

  const handleOperator = (operator: string) => {
    if (result === "Error") return;

    if (result !== "" && !result.endsWith(".")) {
      // Limit expression display to 12 chars for visibility
      let newExpression = "";
      if (showExpression) {
        newExpression = (expression + result + operator).slice(-12);
      } else {
        newExpression = (result + operator).slice(-12);
      }

      setExpression(newExpression);
      setResult("0");
      setShowExpression(true);
      setIsOverflow(false);
    }
  };

  const calculateResult = () => {
    try {
      const fullExpression = expression + result;
      if (!fullExpression) {
        setResult("0");
        setExpression("");
        setShowExpression(false);
        setIsOverflow(false);
        return;
      }

      // Replace × with * for evaluation
      const evalExpression = fullExpression
        .replace(/×/g, "*")
        .replace(/÷/g, "/");

      // Basic safety check - only allow numbers, operators, and decimal points
      const validChars = /^[0-9+\-*/.()]+$/;
      if (!validChars.test(evalExpression.replace(/\s+/g, ""))) {
        throw new Error("Invalid characters");
      }

      // Use Function constructor for safe evaluation
      const calculate = new Function("return " + evalExpression);
      const answer = calculate();

      if (isNaN(answer) || !isFinite(answer)) {
        throw new Error("Invalid calculation");
      }

      // Format the number (remove trailing .0)
      let formattedAnswer = answer.toString();

      // Remove scientific notation for large numbers
      if (formattedAnswer.includes("e")) {
        const num = parseFloat(formattedAnswer);
        formattedAnswer = num.toFixed(6).replace(/\.?0+$/, "");
      }

      // Remove trailing zeros after decimal
      if (formattedAnswer.includes(".")) {
        formattedAnswer = formattedAnswer.replace(/\.?0+$/, "");
      }

      // Format to 7 characters maximum
      const finalResult = formatTo7Chars(formattedAnswer);
      setResult(finalResult);
      setIsOverflow(formattedAnswer.length > 7);
      setExpression("");
      setShowExpression(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setResult("Error");
      setIsOverflow(false);
      setExpression("");
      setShowExpression(false);
    }
  };

  const clearAll = () => {
    setResult("0");
    setExpression("");
    setShowExpression(false);
    setIsOverflow(false);
  };

  const togglePlusMinus = () => {
    if (result === "0" || result === "Error") return;

    let newResult;
    if (result.startsWith("-")) {
      newResult = result.substring(1);
    } else {
      newResult = "-" + result;
    }

    const formattedResult = formatTo7Chars(newResult);
    setResult(formattedResult);
    setIsOverflow(newResult.length > 7);
  };

  const handlePercent = () => {
    if (result === "0" || result === "Error") return;

    try {
      const num = parseFloat(result);
      const percentResult = (num / 100).toString();
      const formattedResult = formatTo7Chars(percentResult);
      setResult(formattedResult);
      setIsOverflow(percentResult.length > 7);
    } catch {
      setResult("Error");
      setIsOverflow(false);
    }
  };

  const handleDecimal = () => {
    if (result === "Error") return;

    if (!result.includes(".")) {
      // Check if adding decimal would exceed 7 chars
      if (result.length >= 7) {
        // Show overflow warning but don't add decimal
        setIsOverflow(true);
        setTimeout(() => setIsOverflow(false), 500);
        return;
      }

      const newResult = result + ".";
      setResult(newResult);
      setIsOverflow(newResult.length >= 7);
    }
  };

  // Format display for overflow
  const formatDisplay = (value: string) => {
    if (value.length <= 7) return value;

    // For overflow, show with smaller font or truncated
    return value.slice(0, 7);
  };

  return (
    <div className="App">
      {/* Pixel heart decorations */}
      <div className="pixel-heart"></div>
      <div className="pixel-heart"></div>
      <div className="pixel-heart"></div>
      <div className="pixel-heart"></div>

      <div className="calculator">
        <h2 className="title">PIXEL CALCULATOR</h2>

        <div className={`display ${isOverflow ? "overflow-warning" : ""}`}>
          {showExpression && (
            <div className="expression">{formatDisplay(expression)}</div>
          )}
          <div
            className={`result ${result === "Error" ? "error" : ""} ${isOverflow ? "overflow" : ""}`}
          >
            {formatDisplay(result)}
          </div>
        </div>

        <div className="buttons">
          {/* Row 1 - Function buttons */}
          <button className="clear-btn" onClick={clearAll}>
            C
          </button>
          <button className="plusminus-btn" onClick={togglePlusMinus}>
            +/-
          </button>
          <button className="percent-btn" onClick={handlePercent}>
            %
          </button>
          <button className="operator-btn" onClick={() => handleOperator("÷")}>
            ÷
          </button>

          {/* Row 2 */}
          <button className="number-btn" onClick={() => handleClick("7")}>
            7
          </button>
          <button className="number-btn" onClick={() => handleClick("8")}>
            8
          </button>
          <button className="number-btn" onClick={() => handleClick("9")}>
            9
          </button>
          <button className="operator-btn" onClick={() => handleOperator("×")}>
            ×
          </button>

          {/* Row 3 */}
          <button className="number-btn" onClick={() => handleClick("4")}>
            4
          </button>
          <button className="number-btn" onClick={() => handleClick("5")}>
            5
          </button>
          <button className="number-btn" onClick={() => handleClick("6")}>
            6
          </button>
          <button className="operator-btn" onClick={() => handleOperator("-")}>
            -
          </button>

          {/* Row 4 */}
          <button className="number-btn" onClick={() => handleClick("1")}>
            1
          </button>
          <button className="number-btn" onClick={() => handleClick("2")}>
            2
          </button>
          <button className="number-btn" onClick={() => handleClick("3")}>
            3
          </button>
          <button className="operator-btn" onClick={() => handleOperator("+")}>
            +
          </button>

          {/* Row 5 - Bottom row */}
          <button className="zero-btn" onClick={() => handleClick("0")}>
            0
          </button>
          <button className="decimal-btn" onClick={handleDecimal}>
            .
          </button>
          <button className="equals-btn" onClick={calculateResult}>
            =
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
