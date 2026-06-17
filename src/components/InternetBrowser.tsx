import React, { useState } from "react";
import { Search, Globe, ChevronLeft, ChevronRight, RotateCw, Home, Shield } from "lucide-react";

interface WebPage {
  url: string;
  title: string;
  content: React.ReactNode;
}

export default function InternetBrowser() {
  const [urlInput, setUrlInput] = useState("www.cool-gem-crawler.net");
  const [currentUrl, setCurrentUrl] = useState("www.cool-gem-crawler.net");
  const [history, setHistory] = useState<string[]>(["www.cool-gem-crawler.net"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [dialupConnecting, setDialupConnecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigateTo = (url: string) => {
    setDialupConnecting(true);
    setTimeout(() => {
      setDialupConnecting(false);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(url);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCurrentUrl(url);
      setUrlInput(url);
    }, 400); // 400ms speed simulation load
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const idx = historyIndex - 1;
      setHistoryIndex(idx);
      setCurrentUrl(history[idx]);
      setUrlInput(history[idx]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const idx = historyIndex + 1;
      setHistoryIndex(idx);
      setCurrentUrl(history[idx]);
      setUrlInput(history[idx]);
    }
  };

  const pages: { [key: string]: WebPage } = {
    "www.cool-gem-crawler.net": {
      url: "www.cool-gem-crawler.net",
      title: "GemCrawler Search Portal!",
      content: (
        <div className="p-4 space-y-4 font-serif text-black select-text">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-widest text-[#000080] uppercase animate-pulse">
              🔍 GEM CRAWLER
            </h1>
            <p className="text-[10px] uppercase font-sans tracking-wide text-gray-500 mt-1">
              "Discovering the Information Superhighway One Crystal at a Time!"
            </p>
          </div>

          <div className="bg-[#e4e4e9] p-3 text-center retro-border-inset max-w-[400px] mx-auto space-y-2">
            <div className="text-xs font-sans font-bold">Search index of 1,997 active web directories:</div>
            <div className="flex gap-1 justify-center">
              <input
                type="text"
                placeholder="Type query (e.g. aliens, chiptunes, geode)..."
                value={searchQuery}
                aria-label="Search field"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="retro-input flex-1 max-w-[200px] h-[24px] text-xs !font-sans"
              />
              <button
                onClick={() => {
                  const q = searchQuery.toLowerCase().trim();
                  if (q.includes("alien") || q.includes("ufo")) {
                    navigateTo("www.area51-geode-secrets.xyz");
                  } else if (q.includes("tune") || q.includes("midi") || q.includes("chip")) {
                    navigateTo("www.retro-waveforms-midicenter.edu");
                  } else if (q.includes("gem") || q.includes("mineral") || q.includes("geode")) {
                    navigateTo("www.mineral-collector-fanclub.com");
                  } else {
                    alert("No directories matched your prompt! Try searching for 'aliens', 'chiptunes', or 'gemstone'! Golly!");
                  }
                }}
                className="retro-button !py-0.5 !px-2.5 text-[11px]"
              >
                Search
              </button>
            </div>
            <div className="text-[9px] uppercase font-mono text-gray-500">
              Hot terms: <span className="underline cursor-pointer" onClick={() => navigateTo("www.area51-geode-secrets.xyz")}>aliens</span>, <span className="underline cursor-pointer" onClick={() => navigateTo("www.retro-waveforms-midicenter.edu")}>chiptunes</span>
            </div>
          </div>

          <div className="border-t border-gray-400 pt-4 max-w-[480px] mx-auto space-y-2.5 font-sans text-xs">
            <div className="font-bold text-[#008080]">POPULAR WEBSITES IN DIRECTORY:</div>
            
            <div
              onClick={() => navigateTo("www.mineral-collector-fanclub.com")}
              className="p-2 border border-gray-300 bg-white hover:bg-slate-50 cursor-pointer rounded"
            >
              <div className="font-bold text-blue-900 underline">Mineral Collector Fanclub (Est. 1996)</div>
              <div className="text-[10px] text-gray-600 mt-1">Dedicated to cataloging the hardest crystalline deposits on the western plateaus.</div>
            </div>

            <div
              onClick={() => navigateTo("www.area51-geode-secrets.xyz")}
              className="p-2 border border-gray-300 bg-white hover:bg-slate-50 cursor-pointer rounded"
            >
              <div className="font-bold text-blue-900 underline">👽 Area-51 Classified Volcano Anomalies 👽</div>
              <div className="text-[10px] text-gray-600 mt-1">Conscience proof that glowing purple quartz crystals are of extraterrestrial extraction origins.</div>
            </div>

            <div
              onClick={() => navigateTo("www.retro-waveforms-midicenter.edu")}
              className="p-2 border border-gray-300 bg-white hover:bg-slate-50 cursor-pointer rounded"
            >
              <div className="font-bold text-blue-900 underline">Retro Soundcard MIDI Conservatory</div>
              <div className="text-[10px] text-gray-600 mt-1">Uncover classical sheet notation for the 16-bit sound synthesizer blaster cards.</div>
            </div>
          </div>
        </div>
      ),
    },
    "www.mineral-collector-fanclub.com": {
      url: "www.mineral-collector-fanclub.com",
      title: "Mineral Collector Fanclub Homepage",
      content: (
        <div className="p-4 space-y-4 font-mono select-text bg-[#008080] text-white min-h-full">
          <div className="text-center p-3 border-2 border-dashed border-yellow-300 bg-[#0c5c5c]">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-yellow-300 uppercase">
              ⛏️ ROCK CLAN CHRONICLES ⛏️
            </h1>
            <p className="text-[10px] italic text-[#cdf1d4] mt-1">"Cataloging nature's sparkling mineral shards since early Windows NT!"</p>
          </div>

          <div className="bg-black/40 p-3 rounded space-y-2 text-xs">
            <h2 className="font-bold text-yellow-300 border-b border-yellow-300 pb-0.5">WEEKLY MINERAL SPOTLIGHT:</h2>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="w-14 h-14 bg-indigo-900 flex items-center justify-center text-3xl border border-yellow-300 shrink-0">💎</div>
              <div>
                <p className="font-bold text-[#b5e61d] uppercase">Volcanic Purple Geode</p>
                <p className="text-[10.5px] leading-relaxed mt-0.5 text-gray-200">
                  Formed in hydrothermal cooling chimneys. Emits high aesthetic energy matching 98% transparency grades. Hardness scale rating: Robust!
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] select-none text-center">
            <div className="bg-amber-800 p-2 border border-[#808080]">
              <span className="font-bold">Estimated Web Visitors:</span>
              <div className="text-yellow-300 text-base font-extrabold font-mono mt-1">0003921</div>
            </div>
            <div className="bg-slate-700 p-2 border border-[#808080] flex flex-col justify-center">
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo("www.cool-gem-crawler.net"); }} className="text-cyan-300 underline font-bold uppercase">
                ← Go back to crawler index
              </a>
            </div>
          </div>
        </div>
      ),
    },
    "www.area51-geode-secrets.xyz": {
      url: "www.area51-geode-secrets.xyz",
      title: "Extraterrestrial Geode Secrets Panel",
      content: (
        <div className="p-4 space-y-4 font-serif text-[#00ff00] select-text bg-black min-h-full">
          <div className="text-center">
            <span className="text-4xl">🛸</span>
            <h1 className="text-xl font-bold tracking-widest text-[#00ff00] uppercase mt-2 animate-pulse">
              ALIEN QUARTZ TELEMETRY
            </h1>
            <p className="text-[10px] font-mono tracking-wider text-red-500 uppercase mt-1">
              "WARNING: Unlocked Classified Web Portal"
            </p>
          </div>

          <p className="text-xs leading-relaxed font-mono">
            On late August 1997, military radar arrays outside Roswell detected unusual energy grids. Field operatives recovered glowing blue gemstone veins with high-frequency soundwave oscillations.
          </p>

          <div className="p-3 bg-red-950/45 border border-red-800 text-[10px] font-mono text-red-400 rounded leading-relaxed">
            <span className="font-bold text-red-500 uppercase flex items-center gap-1 mb-1">
              <Shield size={12} />
              Intel Checklist:
            </span>
            - Gem shards resonate with mineral clicker acceleration setups.<br />
            - Volcanic geode clusters utilize unknown 32-bit speed modules.
          </div>

          <div className="text-center select-none pt-2">
            <button
              onClick={() => navigateTo("www.cool-gem-crawler.net")}
              className="px-4 py-1 border border-[#00ff00] text-[#00ff00] bg-black text-xs font-mono hover:bg-[#003300]"
            >
              [ RETURN TO EARTH WEB INDEX ]
            </button>
          </div>
        </div>
      ),
    },
    "www.retro-waveforms-midicenter.edu": {
      url: "www.retro-waveforms-midicenter.edu",
      title: "Nostalgic MIDI Center Conservatory",
      content: (
        <div className="p-4 space-y-4 font-sans text-black select-text bg-[#fffffa] min-h-full">
          <div className="border-b-4 border-double border-indigo-900 pb-2 text-center">
            <h1 className="text-2xl font-extrabold text-indigo-900 tracking-tight font-display">
              MIDI Synthesizer Conservatory
            </h1>
            <p className="text-[10px] text-gray-500 font-mono italic mt-1">Unified Soundcard Waveforms database</p>
          </div>

          <div className="space-y-2 text-xs">
            <p className="leading-relaxed">
              Before high-definition mp3 servers, the early World Wide Web utilized 16-bit sound synthesizers. Notes are sent sequentially as frequency integers, instructing soundcard internal chips to oscillate triangle, square, or sine waves.
            </p>

            <div className="bg-[#edecee] p-2.5 retro-border-inset font-mono text-[11px] text-slate-800 rounded">
              <span className="font-bold text-[#000080]">Oscillator Sound Waves:</span>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li><span className="font-bold">Square Tones:</span> High grit arcade games (8-Bit classic buzz).</li>
                <li><span className="font-bold">Triangle Tones:</span> Fluid and warm. Perfect for gemstone chime songs.</li>
              </ul>
            </div>
          </div>

          <div className="text-center select-none pt-1">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigateTo("www.cool-gem-crawler.net"); }}
              className="text-indigo-900 hover:text-indigo-700 font-bold underline text-xs"
            >
              ← Back to crawler directory
            </a>
          </div>
        </div>
      ),
    }
  };

  const currentPage = pages[currentUrl] || pages["www.cool-gem-crawler.net"];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-black font-sans bg-[#c0c0c0]" id="app-webbrowser">
      {/* Top Address & Navigation bar */}
      <div className="bg-[#c0c0c0] border-b border-[#808080] p-1.5 flex flex-col gap-1.5 shrink-0 select-none">
        
        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-1">
            <button
              onClick={handleBack}
              disabled={historyIndex === 0}
              className="retro-button !p-1 flex items-center justify-center shrink-0"
              title="Back"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={handleForward}
              disabled={historyIndex === history.length - 1}
              className="retro-button !p-1 flex items-center justify-center shrink-0"
              title="Forward"
            >
              <ChevronRight size={13} />
            </button>
            <button
              onClick={() => navigateTo(currentUrl)}
              className="retro-button !p-1 flex items-center justify-center shrink-0"
              title="Refresh Dialup"
            >
              <RotateCw size={13} />
            </button>
            <button
              onClick={() => navigateTo("www.cool-gem-crawler.net")}
              className="retro-button !p-1 flex items-center justify-center shrink-0"
              title="Homepage"
            >
              <Home size={13} />
            </button>
          </div>

          {/* Web Title Banner */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gray-700 max-w-[190px] truncate">
            <Globe size={13} className="text-[#008080]" />
            <span className="truncate">{currentPage.title}</span>
          </div>

          {/* Core Version info */}
          <div className="text-[9.5px] font-mono text-gray-500 shrink-0 uppercase">
            Net Explorer 4.8
          </div>
        </div>

        {/* Address input field */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10.5px] font-sans font-bold text-gray-700 pl-0.5">Address:</span>
          <div className="flex-1 flex gap-1 items-center">
            <input
              type="text"
              value={urlInput}
              aria-label="Address Bar URL"
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const cleaned = urlInput.trim().toLowerCase();
                  if (pages[cleaned]) {
                    navigateTo(cleaned);
                  } else {
                    alert("Golly! Could not locate that server host domain. Try looking at GemCrawler options!");
                  }
                }
              }}
              className="flex-1 retro-input py-0.5 px-2 h-[22px] text-[11px] font-mono"
            />
            <button
              onClick={() => {
                const cleaned = urlInput.trim().toLowerCase();
                if (pages[cleaned]) navigateTo(cleaned);
                else alert("Domain not found!");
              }}
              className="retro-button !py-0.5 !px-3 h-[22px] flex items-center justification-center shrink-0"
            >
              Go
            </button>
          </div>
        </div>
      </div>

      {/* Main viewport canvas layout */}
      <div className="flex-1 min-h-0 bg-white border-t border-[#808080] overflow-y-auto relative p-1">
        {dialupConnecting ? (
          <div className="absolute inset-0 bg-[#c0c0c0]/90 flex flex-col items-center justify-center gap-3 select-none">
            <Search size={32} className="animate-spin text-[#000080]" />
            <div className="text-center font-mono text-xs text-black">
              <div className="font-bold">DIALUP SEQUENCE RE-ESTABLISHING... (56k)</div>
              <div className="text-[10px] text-gray-600 mt-1">Carrying handshakes with GemCore satellites</div>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[300px]">
            {currentPage.content}
          </div>
        )}
      </div>

      {/* Warning Bottom Footbar */}
      <div className="bg-[#c0c0c0] border-t border-[#808080] px-2 py-0.5 flex items-center justify-between font-sans text-[10px] text-gray-600 shrink-0">
        <span className="truncate">Zone: Trustworthy Intranet Core (100% Cryptographic validation)</span>
        <span className="shrink-0 font-mono tracking-wide">● CONNECTED</span>
      </div>
    </div>
  );
}
