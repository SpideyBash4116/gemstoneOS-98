import React, { useState, useEffect } from "react";
import { Sparkles, ShoppingBag, Pickaxe, Landmark, Zap, Shield, HelpCircle } from "lucide-react";
import { UpgradeItem } from "../types";

export default function MineralClicker() {
  const [totalGems, setTotalGems] = useState<number>(() => {
    const saved = localStorage.getItem("gemstoneOS_clicker_gems");
    return saved ? parseFloat(saved) : 0;
  });
  const [clickValue, setClickValue] = useState<number>(1);
  const [gps, setGps] = useState<number>(0); // Gemstones Per Second
  const [isClicking, setIsClicking] = useState(false);

  // Upgrades list
  const [upgrades, setUpgrades] = useState<UpgradeItem[]>(() => {
    const saved = localStorage.getItem("gemstoneOS_clicker_upgrades");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse clicker upgrades, falling back to defaults", e);
      }
    }
    return [
      {
        id: "shovel",
        name: "Brass Shovel",
        cost: 15,
        gps: 0.2,
        count: 0,
        icon: "shovel",
        description: "A rusty handheld spade to clear loose sediment layers.",
      },
      {
        id: "miner",
        name: "Robotic Miner Bot",
        cost: 100,
        gps: 1.5,
        count: 0,
        icon: "robot",
        description: "A mechanical robotic worm that digs automated tunnels.",
      },
      {
        id: "rig",
        name: "Steam Drill Rig",
        cost: 800,
        gps: 8,
        count: 0,
        icon: "drill",
        description: "A colossal, high-pressure steam power drill module.",
      },
      {
        id: "refinery",
        name: "Chamber Refinery",
        cost: 4500,
        gps: 45,
        count: 0,
        icon: "factory",
        description: "An automated retro processing plant separating diamond veins.",
      },
      {
        id: "satellite",
        name: "Orbit Deep Scanner",
        cost: 25000,
        gps: 260,
        count: 0,
        icon: "satellite",
        description: "An advanced high-altitude satellite tracking deep geodes.",
      },
      {
        id: "matrix",
        name: "Quantum Gem Matrix",
        cost: 150000,
        gps: 1800,
        count: 0,
        icon: "matrix",
        description: "Sub-atomic crystal replication that forms diamonds out of air.",
      }
    ];
  });

  // Save game state whenever gems/upgrades change
  useEffect(() => {
    localStorage.setItem("gemstoneOS_clicker_gems", totalGems.toString());
    localStorage.setItem("gemstoneOS_clicker_upgrades", JSON.stringify(upgrades));
  }, [totalGems, upgrades]);

  // Calculate total GPS and Click Value
  useEffect(() => {
    let calculatedGps = 0;
    upgrades.forEach((u) => {
      calculatedGps += u.count * u.gps;
    });
    setGps(calculatedGps);

    // Click value goes up based on tools bought
    const shovelCount = upgrades.find((u) => u.id === "shovel")?.count || 0;
    const minerCount = upgrades.find((u) => u.id === "miner")?.count || 0;
    const rigCount = upgrades.find((u) => u.id === "rig")?.count || 0;
    
    setClickValue(1 + (shovelCount * 0.5) + (minerCount * 1.5) + (rigCount * 5));
  }, [upgrades]);

  // Game loop: add GPS every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      if (gps > 0) {
        setTotalGems((prev) => prev + (gps / 10));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [gps]);

  const handleGemClick = () => {
    setIsClicking(true);
    setTotalGems((prev) => prev + clickValue);
    setTimeout(() => setIsClicking(false), 90);
  };

  const buyUpgrade = (id: string) => {
    const item = upgrades.find((u) => u.id === id);
    if (!item || totalGems < item.cost) return;

    const newCost = Math.round(item.cost * 1.15);
    const updated = upgrades.map((u) => {
      if (u.id === id) {
        return {
          ...u,
          count: u.count + 1,
          cost: newCost,
        };
      }
      return u;
    });

    setTotalGems((prev) => prev - item.cost);
    setUpgrades(updated);
  };

  const resetGame = () => {
    if (confirm("Golly! Are you sure you want to restore the planetary mine registry back to zero?")) {
      setTotalGems(0);
      setUpgrades(
        upgrades.map((u) => {
          let origCost = 15;
          if (u.id === "miner") origCost = 100;
          if (u.id === "rig") origCost = 800;
          if (u.id === "refinery") origCost = 4500;
          if (u.id === "satellite") origCost = 25000;
          if (u.id === "matrix") origCost = 150000;
          return { ...u, count: 0, cost: origCost };
        })
      );
    }
  };

  const getIconElement = (iconName: string) => {
    switch (iconName) {
      case "shovel": return <Pickaxe size={16} className="text-amber-800" />;
      case "robot": return <Zap size={16} className="text-blue-800" />;
      case "drill": return <Landmark size={16} className="text-slate-800" />;
      case "factory": return <ShoppingBag size={16} className="text-red-700" />;
      case "satellite": return <Shield size={16} className="text-emerald-700" />;
      default: return <Sparkles size={16} className="text-purple-700" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden text-black font-mono bg-[#c0c0c0]" id="app-clicker">
      
      {/* Clicker Left Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 border-b md:border-b-0 md:border-r border-[#808080] min-h-[200px] md:min-h-0">
        
        {/* Score LCD panel */}
        <div className="retro-border-inset bg-black p-2.5 text-center min-w-[190px] mb-2 leading-none">
          <div className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase mb-1">Crystalline Reserves</div>
          <div className="text-2xl sm:text-3xl text-emerald-500 font-bold select-none truncate px-1">
            {Math.floor(totalGems).toLocaleString()} 💎
          </div>
          <div className="text-[11px] text-emerald-300 font-mono mt-1 font-semibold">
            {gps.toFixed(1)} GPS / +{clickValue.toFixed(1)} PER CLICK
          </div>
        </div>

        {/* The Clickable Gemstone Container */}
        <div className="relative my-3 flex items-center justify-center">
          <button
            onClick={handleGemClick}
            className={`w-32 h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center bg-radial from-cyan-400 to-indigo-800 shadow-2xl focus:outline-none transition-transform active:scale-90 duration-75 ${
              isClicking ? "scale-[0.93]" : "hover:brightness-110 active:brightness-95"
            }`}
            title="Drill Gemstone!"
            style={{
              clipPath: "polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)"
            }}
          >
            <div className={`w-28 h-28 md:w-32 md:h-32 bg-indigo-900 flex flex-col items-center justify-center relative border-4 border-cyan-300 text-white`}>
              <Sparkles size={36} className={`${isClicking ? "animate-ping" : ""} text-cyan-300`} />
              <span className="text-[9px] font-bold tracking-widest mt-1 uppercase select-none text-shadow-sm font-sans text-cyan-100">MINE ORE</span>
            </div>
          </button>
        </div>

        {/* Mine Controls */}
        <div className="flex items-center gap-1.5 mt-2">
          <button
            onClick={resetGame}
            className="retro-button !text-[10px] !py-1 !px-2.5 flex items-center gap-1"
          >
            Reset Registry
          </button>
          
          <div className="text-[10px] text-gray-500 font-sans flex items-center justify-center gap-1">
            <HelpCircle size={10} />
            <span>Miner stats cached in localStorage</span>
          </div>
        </div>
      </div>

      {/* Upgrades List Right Area */}
      <div className="w-full md:w-[320px] p-2 overflow-y-auto flex flex-col shrink-0">
        <div className="text-xs font-bold text-gray-700 mb-2 border-b border-[#808080] pb-1 flex items-center gap-1 shrink-0">
          <ShoppingBag size={13} className="text-blue-800" />
          <span>MINING RIG STORES & HARDWARE</span>
        </div>

        {/* Upgrades list */}
        <div className="flex-1 overflow-y-auto space-y-1.5 p-0.5">
          {upgrades.map((u) => {
            const canAfford = totalGems >= u.cost;
            return (
              <div
                key={u.id}
                className={`retro-border-outset p-1.5 flex items-center justify-between text-left transition-colors ${
                  canAfford ? "bg-[#c0c0c0]" : "opacity-75"
                }`}
              >
                <div className="flex items-center gap-2 max-w-[70%] select-none">
                  <div className="retro-border-inset p-1.5 bg-gray-100 shrink-0">
                    {getIconElement(u.icon)}
                  </div>
                  <div className="truncate">
                    <div className="text-[11.5px] font-extrabold truncate text-slate-950">{u.name}</div>
                    <div className="text-[9px] text-gray-600 truncate leading-snug">{u.description}</div>
                    <div className="text-[9px] font-mono text-emerald-800 font-semibold leading-none mt-1">
                      +{u.gps} GPS / Count: {u.count}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <button
                    onClick={() => buyUpgrade(u.id)}
                    disabled={!canAfford}
                    className={`retro-button !py-1 !px-2 text-[10px] leading-tight font-extrabold ${
                      canAfford ? "!text-emerald-950" : "!text-gray-500 bg-gray-300"
                    }`}
                  >
                    Buy Tool
                  </button>
                  <div className="text-[9.5px] font-mono mt-1 font-bold text-slate-800">
                    💎{u.cost}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
