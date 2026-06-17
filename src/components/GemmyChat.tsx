import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Send, RefreshCw, Smartphone, Bot, AlertTriangle } from "lucide-react";
import { ChatMessage } from "../types";

export default function GemmyChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Add custom retro welcome message on boot
    const welcomeMsgs: ChatMessage[] = [
      {
        id: "wel-1",
        role: "assistant",
        text: "Golly! Welcome to gemstoneOS 98 Jan Mayen! I am Gemmy, your virtual interactive geode assistant. " +
              "Whether you want to paint custom artwork, solve deep minesweeper deposits, or explore the Information Superhighway, I'm here to help you navigate with 32-bit speed power! " +
              "Ask me anything about old technology, or request commands!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ];
    setMessages(welcomeMsgs);
  }, []);

  // Scroll to bottom when message arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);
    setErrorStatus(null);

    try {
      // Map history for endpoint (keep it compact: last 6 messages)
      const chatHistory = messages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/gemmy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMsg.text,
          history: chatHistory,
        }),
      });

      if (!res.ok) {
        throw new Error("Core processor failure reading satellite link. Try checking API credentials.");
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const gemmyMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: "assistant",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, gemmyMsg]);
    } catch (error: any) {
      console.error(error);
      setErrorStatus(error.message || "Failed to reach GemCore servers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("Restore dialogue index?")) {
      setMessages([
        {
          id: "wel-r",
          role: "assistant",
          text: "Dial-up link re-sequenced! What magical mineral computations shall we run next, commander?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      setErrorStatus(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-black font-sans bg-[#c0c0c0]" id="app-gemmy">
      {/* Gemmy Animated Mascot Avatar Panel */}
      <div className="bg-[#000080] p-2 flex items-center justify-between text-white shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <Bot size={15} className="text-cyan-300 animate-bounce" />
          <span className="text-xs font-extrabold tracking-wide">GEMMY AI COGNITIVE HARNESS</span>
        </div>
        
        <button
          onClick={handleClearChat}
          className="retro-button !py-0.5 !px-1.5 !bg-[#c0c0c0] !text-black flex items-center gap-1"
          title="Clear system matrix memory"
        >
          <RefreshCw size={10} />
          <span>Clear RAM</span>
        </button>
      </div>

      {/* Main chat layout wrapper */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        
        {/* Left Side: Avatar Animating Box */}
        <div className="w-full md:w-36 bg-[#dfdfdf] border-b md:border-b-0 md:border-r border-[#808080] p-2 flex flex-row md:flex-col items-center justify-center gap-2 shrink-0 select-none">
          {/* Animated Gem Sphere */}
          <div className="relative group flex items-center justify-center">
            <div className="absolute w-20 h-20 bg-cyan-400/20 blur-xl rounded-full group-hover:scale-125 transition-all duration-1000" />
            <div className="w-16 h-16 bg-gradient-to-tr from-sky-400 to-indigo-700 rounded-full border-2 border-white flex items-center justify-center shadow-lg relative cursor-help gemmy-animated">
              {/* Goofy character facial details */}
              <div className="flex flex-col items-center justify-center select-none">
                <div className="flex items-center gap-1.5 justify-center">
                  <div className="w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center relative">
                    <div className="w-1 h-1 bg-black rounded-full absolute bottom-0.5 right-0.5" />
                  </div>
                  <div className="w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center relative">
                    <div className="w-1 h-1 bg-black rounded-full absolute bottom-0.5 left-0.5" />
                  </div>
                </div>
                <div className="w-3.5 h-1.5 bg-amber-400 border border-amber-900 rounded-b-full mt-1 animate-pulse" />
              </div>

              {/* Sparkling tiny crystals */}
              <div className="absolute -top-1 -right-1 text-yellow-300 animate-pulse text-[11px]">✨</div>
              <div className="absolute -bottom-1 -left-1 text-cyan-300 animate-pulse text-[11px] delay-300">💎</div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <div className="text-[11px] font-sans font-extrabold text-[#000080]">Agent: Gemmy</div>
            <div className="text-[9px] text-gray-500 font-mono mt-0.5 leading-none">STATUS: ONLINE (56KBps)</div>
            <div className="text-[9px] text-gray-400 font-mono mt-1 shrink-0">Model: Gemini 3.5</div>
          </div>
        </div>

        {/* Right Side: Message Dialogue Console */}
        <div className="flex-1 flex flex-col p-2 min-h-0 min-w-0">
          <div
            ref={scrollRef}
            className="flex-1 bg-white retro-border-inset overflow-y-auto p-2.5 space-y-3 max-h-[190px] md:max-h-none"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col max-w-[88%] ${m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-mono mb-1 font-semibold select-none">
                  <span>{m.role === "user" ? "Commander (You)" : "Gemmy (Wizard)"}</span>
                  <span>•</span>
                  <span>{m.timestamp}</span>
                </div>
                
                <div
                  className={`p-2 font-sans text-[11.5px] leading-relaxed break-words relative shadow-sm rounded ${
                    m.role === "user"
                      ? "bg-[#cfe1ee] text-slate-900 retro-border-outset"
                      : "bg-[#f5f5f5] text-stone-900 retro-border-inset"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-[11px] text-gray-600 font-mono italic p-2 rounded bg-yellow-50 max-w-[170px] select-none">
                <Smartphone size={12} className="animate-spin text-amber-800" />
                <span>Synchronizing dial-up...</span>
              </div>
            )}

            {errorStatus && (
              <div className="p-2.5 bg-red-50 text-red-800 border border-red-300 rounded text-[11px] max-w-[340px] flex items-start gap-1.5 select-text">
                <AlertTriangle size={14} className="text-red-700 shrink-0 mt-0.5" />
                <div className="font-mono">
                  <div className="font-bold uppercase">Satellite Fault:</div>
                  <div className="mt-1">{errorStatus}</div>
                  <div className="text-[9px] text-gray-500 font-sans mt-1.5 leading-normal">
                    Tip: Configure your GEMINI_API_KEY inside the platform's Settings menu to unlock Gemmy in full.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Prompt Entry Box */}
          <form onSubmit={handleSendMessage} className="mt-2 flex gap-1.5 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 retro-input py-1 px-2.5 h-[28px] text-[12px] placeholder:italic"
              placeholder="Query GemCore processors index... (e.g. Tell me a retro tech joke)"
              title="Query Input Bar"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="retro-button h-[28px] !px-3.5 flex items-center gap-1 active:scale-95"
            >
              <Send size={11} />
              <span>Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
