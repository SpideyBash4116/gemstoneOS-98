import React, { useState } from "react";
import { Calculator as CalcIcon } from "lucide-react";

interface CalculatorProps {
  onPlayClick?: () => void;
}

export default function Calculator({ onPlayClick }: CalculatorProps) {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isResetOnNext, setIsResetOnNext] = useState(false);
  const [memory, setMemory] = useState<number>(0);

  const handleDigit = (digit: string) => {
    onPlayClick?.();
    if (display === "0" || isResetOnNext) {
      setDisplay(digit);
      setIsResetOnNext(false);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleDecimal = () => {
    onPlayClick?.();
    if (isResetOnNext) {
      setDisplay("0.");
      setIsResetOnNext(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperator = (op: string) => {
    onPlayClick?.();
    const currentVal = parseFloat(display);
    
    if (equation && !isResetOnNext) {
      // Calculate intermediate result
      try {
        const fullExp = `${equation} ${currentVal}`;
        // Safe evaluation of simple math expressions
        const res = evaluateSimpleExpression(fullExp);
        setDisplay(String(res));
        setEquation(`${res} ${op}`);
      } catch (err) {
        setDisplay("Error");
        setEquation("");
      }
    } else {
      setEquation(`${currentVal} ${op}`);
    }
    setIsResetOnNext(true);
  };

  const handleEquals = () => {
    onPlayClick?.();
    if (!equation) return;
    const currentVal = parseFloat(display);
    try {
      const fullExp = `${equation} ${currentVal}`;
      const res = evaluateSimpleExpression(fullExp);
      setDisplay(String(res));
      setEquation("");
      setIsResetOnNext(true);
    } catch (err) {
      setDisplay("Error");
      setEquation("");
    }
  };

  const handleClear = () => {
    onPlayClick?.();
    setDisplay("0");
    setEquation("");
    setIsResetOnNext(false);
  };

  const handleClearEntry = () => {
    onPlayClick?.();
    setDisplay("0");
  };

  const handleBackspace = () => {
    onPlayClick?.();
    if (isResetOnNext) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleNegate = () => {
    onPlayClick?.();
    const val = parseFloat(display);
    setDisplay(String(val * -1));
  };

  const handleSqrt = () => {
    onPlayClick?.();
    try {
      const val = parseFloat(display);
      if (val < 0) {
        setDisplay("Invalid Input");
      } else {
        setDisplay(String(Math.sqrt(val)));
      }
      setIsResetOnNext(true);
    } catch {
      setDisplay("Error");
    }
  };

  const handlePercent = () => {
    onPlayClick?.();
    try {
      const val = parseFloat(display);
      setDisplay(String(val / 100));
      setIsResetOnNext(true);
    } catch {
      setDisplay("Error");
    }
  };

  const handleOneOverX = () => {
    onPlayClick?.();
    try {
      const val = parseFloat(display);
      if (val === 0) {
        setDisplay("Cannot divide by zero");
      } else {
        setDisplay(String(1 / val));
      }
      setIsResetOnNext(true);
    } catch {
      setDisplay("Error");
    }
  };

  // Memory functions
  const handleMemoryClear = () => {
    onPlayClick?.();
    setMemory(0);
  };

  const handleMemoryRecall = () => {
    onPlayClick?.();
    setDisplay(String(memory));
    setIsResetOnNext(true);
  };

  const handleMemoryStore = () => {
    onPlayClick?.();
    setMemory(parseFloat(display));
    setIsResetOnNext(true);
  };

  const handleMemoryAdd = () => {
    onPlayClick?.();
    setMemory(prev => prev + parseFloat(display));
    setIsResetOnNext(true);
  };

  // Safe arithmetic parser
  const evaluateSimpleExpression = (exp: string): number => {
    const parts = exp.trim().split(/\s+/);
    if (parts.length < 3) return parseFloat(parts[0]) || 0;
    
    let result = parseFloat(parts[0]);
    for (let i = 1; i < parts.length; i += 2) {
      const operator = parts[i];
      const nextVal = parseFloat(parts[i + 1]);
      if (isNaN(nextVal)) continue;

      if (operator === "+") result += nextVal;
      else if (operator === "-") result -= nextVal;
      else if (operator === "*") result *= nextVal;
      else if (operator === "/") {
        if (nextVal === 0) throw new Error("Divide by zero");
        result /= nextVal;
      }
    }
    return result;
  };

  return (
    <div className="flex-1 flex flex-col p-3 bg-[#c0c0c0] font-mono select-none text-black h-full" id="retro-calculator">
      {/* Equation display hint */}
      <div className="text-[10px] text-right text-stone-600 h-4 truncate pr-1 select-all">
        {equation || <span className="opacity-30">gemstoneOS Core Math Unit</span>}
      </div>

      {/* Main LCD style Display */}
      <div className="retro-border-inset bg-white p-2.5 mb-3.5 text-right font-sans text-2xl font-bold min-w-[240px] text-zinc-900 select-all overflow-hidden h-12 leading-tight flex items-center justify-end">
        {display}
      </div>

      <div className="flex gap-3 items-stretch justify-between flex-1">
        {/* Left Memory Options column */}
        <div className="flex flex-col gap-1.5 justify-between">
          <button
            onClick={handleMemoryClear}
            className="w-10 h-8 text-[11px] font-bold text-red-800 retro-button"
            title="Memory Clear (MC)"
          >
            MC
          </button>
          <button
            onClick={handleMemoryRecall}
            className="w-10 h-8 text-[11px] font-bold text-red-800 retro-button"
            title="Memory Recall (MR)"
          >
            MR
          </button>
          <button
            onClick={handleMemoryStore}
            className="w-10 h-8 text-[11px] font-bold text-red-800 retro-button"
            title="Memory Store (MS)"
          >
            MS
          </button>
          <button
            onClick={handleMemoryAdd}
            className="w-10 h-8 text-[11px] font-bold text-red-800 retro-button"
            title="Memory Add (M+)"
          >
            M+
          </button>
          <div className="flex-1 border border-stone-400 bg-stone-100 flex items-center justify-center font-bold text-xs p-1" title="Memory state light">
            {memory !== 0 ? <span className="text-red-800 text-[10px]">M</span> : <span className="opacity-0">M</span>}
          </div>
        </div>

        {/* Core Calculation keys layout */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Top special controls (Backspace, CE, C) */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={handleBackspace}
              className="px-2 py-1.5 text-xs text-red-800 bg-[#c0c0c0] font-bold retro-button hover:bg-stone-100"
            >
              Back
            </button>
            <button
              onClick={handleClearEntry}
              className="px-2 py-1.5 text-xs text-red-800 bg-[#c0c0c0] font-bold retro-button hover:bg-stone-100"
            >
              CE
            </button>
            <button
              onClick={handleClear}
              className="px-2 py-1.5 text-xs text-red-800 bg-[#c0c0c0] font-bold retro-button hover:bg-stone-100"
            >
              C
            </button>
          </div>

          {/* Numbers & fundamental operators grids */}
          <div className="grid grid-cols-5 gap-1.5 flex-1 select-none">
            {/* Row 1: 7, 8, 9, /, sqrt */}
            <button onClick={() => handleDigit("7")} className="retro-button !bg-white text-sm font-extrabold font-sans">7</button>
            <button onClick={() => handleDigit("8")} className="retro-button !bg-white text-sm font-extrabold font-sans">8</button>
            <button onClick={() => handleDigit("9")} className="retro-button !bg-white text-sm font-extrabold font-sans">9</button>
            <button onClick={() => handleOperator("/")} className="retro-button text-red-800 text-sm font-extrabold">/</button>
            <button onClick={handleSqrt} className="retro-button text-zinc-700 text-xs font-bold leading-none">sqrt</button>

            {/* Row 2: 4, 5, 6, *, % */}
            <button onClick={() => handleDigit("4")} className="retro-button !bg-white text-sm font-extrabold font-sans">4</button>
            <button onClick={() => handleDigit("5")} className="retro-button !bg-white text-sm font-extrabold font-sans">5</button>
            <button onClick={() => handleDigit("6")} className="retro-button !bg-white text-sm font-extrabold font-sans">6</button>
            <button onClick={() => handleOperator("*")} className="retro-button text-red-800 text-sm font-extrabold">*</button>
            <button onClick={handlePercent} className="retro-button text-zinc-700 text-sm font-bold">%</button>

            {/* Row 3: 1, 2, 3, -, 1/x */}
            <button onClick={() => handleDigit("1")} className="retro-button !bg-white text-sm font-extrabold font-sans">1</button>
            <button onClick={() => handleDigit("2")} className="retro-button !bg-white text-sm font-extrabold font-sans">2</button>
            <button onClick={() => handleDigit("3")} className="retro-button !bg-white text-sm font-extrabold font-sans">3</button>
            <button onClick={() => handleOperator("-")} className="retro-button text-red-800 text-sm font-extrabold">-</button>
            <button onClick={handleOneOverX} className="retro-button text-zinc-700 text-xs font-bold">1/x</button>

            {/* Row 4: 0, +/-, ., +, = */}
            <button onClick={() => handleDigit("0")} className="retro-button !bg-white text-sm font-extrabold font-sans">0</button>
            <button onClick={handleNegate} className="retro-button text-sm font-bold">+/-</button>
            <button onClick={handleDecimal} className="retro-button text-sm font-bold">.</button>
            <button onClick={() => handleOperator("+")} className="retro-button text-red-800 text-sm font-extrabold">+</button>
            <button onClick={handleEquals} className="retro-button !bg-red-800 !text-white text-sm font-extrabold">=</button>
          </div>
        </div>
      </div>

      {/* Decorative footer */}
      <div className="text-[9px] text-[#404040] font-sans text-center mt-3 pt-1.5 border-t border-stone-300">
        Intel(R) 80387 Math Co-Processor Emulation Active
      </div>
    </div>
  );
}
