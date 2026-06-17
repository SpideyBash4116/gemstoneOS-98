import React, { useState, useEffect, useCallback, useRef } from "react";
import { Hammer, Trophy, Sparkles } from "lucide-react";

interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export default function GemSweeper() {
  const [gridSize, setGridSize] = useState<{ rows: number; cols: number; mines: number }>({
    rows: 9,
    cols: 9,
    mines: 10,
  });

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [minesRemaining, setMinesRemaining] = useState(10);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [faceState, setFaceState] = useState<"🙂" | "😮" | "😵" | "😎">("🙂");

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize the sweeper board
  const initializeBoard = useCallback(() => {
    const { rows, cols, mines } = gridSize;
    
    // Create blank grid
    const blankGrid: Cell[][] = [];
    for (let r = 0; r < rows; r++) {
      const rowArr: Cell[] = [];
      for (let c = 0; c < cols; c++) {
        rowArr.push({
          r,
          c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      blankGrid.push(rowArr);
    }

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);
      
      if (!blankGrid[randomRow][randomCol].isMine) {
        blankGrid[randomRow][randomCol].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (blankGrid[r][c].isMine) continue;
        
        let count = 0;
        // Check 8 neighbors
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              if (blankGrid[nr][nc].isMine) count++;
            }
          }
        }
        blankGrid[r][c].neighborMines = count;
      }
    }

    setGrid(blankGrid);
    setGameStatus("idle");
    setMinesRemaining(mines);
    setElapsedTime(0);
    setFaceState("🙂");

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, [gridSize]);

  // Restart trigger
  useEffect(() => {
    initializeBoard();
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [initializeBoard]);

  // Timer run
  useEffect(() => {
    if (gameStatus === "playing") {
      timerIntervalRef.current = setInterval(() => {
        setElapsedTime((prev) => Math.min(999, prev + 1));
      }, 1000);
    } else if (gameStatus === "won" || gameStatus === "lost" || gameStatus === "idle") {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [gameStatus]);

  // Change grid size / difficulty
  const handleDifficultyChange = (rows: number, cols: number, mines: number) => {
    setGridSize({ rows, cols, mines });
  };

  // Flood fill algorithm for blank cells
  const revealCell = (tempGrid: Cell[][], r: number, c: number) => {
    const { rows, cols } = gridSize;
    const queue: [number, number][] = [[r, c]];
    
    while (queue.length > 0) {
      const [currR, currC] = queue.shift()!;
      const cell = tempGrid[currR][currC];
      if (cell.isRevealed || cell.isFlagged) continue;
      
      cell.isRevealed = true;
      
      if (cell.neighborMines === 0 && !cell.isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              if (!tempGrid[nr][nc].isRevealed && !tempGrid[nr][nc].isMine && !tempGrid[nr][nc].isFlagged) {
                queue.push([nr, nc]);
              }
            }
          }
        }
      }
    }
  };

  // Check victory condition
  const checkWinCondition = (tempGrid: Cell[][]) => {
    const { rows, cols, mines } = gridSize;
    let unrevealedCount = 0;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!tempGrid[r][c].isRevealed) {
          unrevealedCount++;
        }
      }
    }
    
    if (unrevealedCount === mines) {
      setGameStatus("won");
      setFaceState("😎");
      // Autopin flag remaining mines
      const finalGrid = tempGrid.map(row => row.map(cell => {
        if (cell.isMine) return { ...cell, isFlagged: true };
        return cell;
      }));
      setGrid(finalGrid);
      setMinesRemaining(0);
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (gameStatus === "lost" || gameStatus === "won") return;
    
    let tempGrid = [...grid.map(row => [...row])];
    let currentCell = tempGrid[r][c];
    
    if (currentCell.isFlagged || currentCell.isRevealed) return;

    let nextStatus = gameStatus;
    if (gameStatus === "idle") {
      nextStatus = "playing";
      setGameStatus("playing");
    }

    if (currentCell.isMine) {
      // Boom! Game Over
      setGameStatus("lost");
      setFaceState("😵");
      // Reveal all mines is standard minesweeper
      tempGrid = tempGrid.map(row => row.map(cell => {
        if (cell.isMine) return { ...cell, isRevealed: true };
        return cell;
      }));
      setGrid(tempGrid);
      return;
    }

    revealCell(tempGrid, r, c);
    setGrid(tempGrid);
    checkWinCondition(tempGrid);
  };

  const handleCellRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameStatus === "lost" || gameStatus === "won") return;
    
    const tempGrid = [...grid.map(row => [...row])];
    const cell = tempGrid[r][c];
    
    if (cell.isRevealed) return;

    if (cell.isFlagged) {
      cell.isFlagged = false;
      setMinesRemaining(prev => prev + 1);
    } else {
      if (minesRemaining > 0) {
        cell.isFlagged = true;
        setMinesRemaining(prev => prev - 1);
      }
    }

    setGrid(tempGrid);
  };

  const getNumberColor = (num: number) => {
    switch (num) {
      case 1: return "text-blue-800 font-bold";
      case 2: return "text-green-800 font-bold";
      case 3: return "text-red-700 font-bold";
      case 4: return "text-purple-900 font-bold";
      case 5: return "text-amber-900 font-bold";
      case 6: return "text-teal-900 font-bold";
      case 7: return "text-black font-extrabold";
      case 8: return "text-slate-500 font-extrabold";
      default: return "text-transparent";
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-2 h-full select-none text-black font-mono bg-[#c0c0c0]" id="app-gemsweeper">
      {/* Top Setting Tab */}
      <div className="flex items-center gap-1.5 w-full justify-center pb-2 border-b border-[#808080] mb-2 shrink-0">
        <button
          onClick={() => handleDifficultyChange(9, 9, 10)}
          className={`retro-button !py-0.5 !px-2 text-[10px] ${gridSize.rows === 9 ? "bg-[#e2e2e2] border-t-[#808080] border-l-[#808080] border-r-white border-b-white" : ""}`}
        >
          Beginner (9x9)
        </button>
        <button
          onClick={() => handleDifficultyChange(12, 12, 22)}
          className={`retro-button !py-0.5 !px-2 text-[10px] ${gridSize.rows === 12 ? "bg-[#e2e2e2] border-t-[#808080] border-l-[#808080] border-r-white border-b-white" : ""}`}
        >
          Miner's Guild (12x12)
        </button>
      </div>

      {/* Retro Header Panel */}
      <div className="retro-border-inset p-1.5 bg-[#c0c0c0] w-full max-w-[340px] flex items-center justify-between shrink-0 mb-2">
        {/* Flag Counter */}
        <div className="bg-black text-[22px] font-mono leading-none text-red-600 px-2 py-0.5 min-w-[50px] text-center border border-[#808080] shadow-inner select-none font-bold">
          {String(Math.max(0, minesRemaining)).padStart(3, "0")}
        </div>

        {/* Smiley Reset Button */}
        <button
          onClick={initializeBoard}
          onMouseDown={() => setFaceState("😮")}
          onMouseUp={() => setFaceState(gameStatus === "won" ? "😎" : gameStatus === "lost" ? "😵" : "🙂")}
          className="retro-button w-10 h-10 flex items-center justify-center p-0 text-2xl"
        >
          {faceState}
        </button>

        {/* Stopwatch LCD timer */}
        <div className="bg-black text-[22px] font-mono leading-none text-red-600 px-2 py-0.5 min-w-[50px] text-center border border-[#808080] shadow-inner select-none font-bold">
          {String(elapsedTime).padStart(3, "0")}
        </div>
      </div>

      {/* Sweeper Cell Grid */}
      <div className="flex-1 flex items-center justify-center min-h-0 w-full p-1 overflow-auto">
        <div
          className="grid gap-[1px] bg-[#808080] p-[2px] border-b border-r border-white border-t-[#808080] border-l-[#808080]"
          style={{
            gridTemplateRows: `repeat(${gridSize.rows}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${gridSize.cols}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((row) =>
            row.map((cell) => (
              <div
                key={`${cell.r}-${cell.c}`}
                onClick={() => handleCellClick(cell.r, cell.c)}
                onContextMenu={(e) => handleCellRightClick(e, cell.r, cell.c)}
                className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs sm:text-sm font-extrabold cursor-default relative select-none ${
                  cell.isRevealed
                    ? "bg-[#c0c0c0] border border-[#a0a0a0]"
                    : "bg-[#c0c0c0] border-t-[2px] border-l-[2px] border-t-white border-l-white border-b-[2px] border-r-[2px] border-b-[#808080] border-r-[#808080] active:border-1"
                }`}
              >
                {cell.isRevealed ? (
                  cell.isMine ? (
                    <div className="w-full h-full bg-red-600 flex items-center justify-center text-black text-[10px]">
                      💣
                    </div>
                  ) : cell.neighborMines > 0 ? (
                    <span className={getNumberColor(cell.neighborMines)}>{cell.neighborMines}</span>
                  ) : null
                ) : cell.isFlagged ? (
                  <span className="text-red-600 text-xs text-shadow-sm select-none" title="Gem crystal identified">
                    💎
                  </span>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Legend guide */}
      <div className="text-[10px] text-gray-600 mt-2 text-center w-full shrink-0 flex items-center justify-center gap-1">
        <Sparkles size={10} className="text-blue-600" />
        <span>Tip: 💎 = Flag Gemstone Ore. Avoid detonating deep geode volcanic faults!</span>
      </div>
    </div>
  );
}
