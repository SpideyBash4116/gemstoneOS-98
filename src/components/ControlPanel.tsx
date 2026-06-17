import React, { useState } from "react";
import { Monitor, Volume2, ShieldAlert, Sparkles, Sliders, Play } from "lucide-react";
import { SystemSettings, WallpaperPreset } from "../types";

interface ControlPanelProps {
  settings: SystemSettings;
  onChangeSettings: (settings: SystemSettings) => void;
  onPreviewScreensaver: () => void;
  onTriggerBsod?: () => void;
}

export default function ControlPanel({
  settings,
  onChangeSettings,
  onPreviewScreensaver,
  onTriggerBsod
}: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<"wallpaper" | "sounds" | "screensaver" | "diagnostic">("wallpaper");

  const wallpapers: { preset: WallpaperPreset; name: string; desc: string; color: string }[] = [
    { preset: "teal", name: "Modern Teal '98", desc: "Our beautiful flagship gemstoneOS brand palette.", color: "bg-[#0d5c5c]" },
    { preset: "win95-classic", name: "Redwood Classic Green", desc: "The standard vintage green desktop canvas.", color: "bg-[#008080]" },
    { preset: "space-stars", name: "Astral Nebula", desc: "Custom galaxy backdrop with shining starlight.", color: "bg-[#03030f]" },
    { preset: "gradient-sunset", name: "Synthwave Sunset", desc: "Warm high-intensity classic 32-bit gradient.", color: "bg-gradient-to-br from-indigo-900 to-red-600" },
    { preset: "retro-brick", name: "Red Castle Bricks", desc: "Tiled texture mirroring traditional building masonry.", color: "bg-[#8b0000]" },
    { preset: "hot-pink", name: "Neon Cyberpunk", desc: "Bold, brilliant neon pink for experimental hardware.", color: "bg-[#ff1493]" },
  ];

  const handleSelectWallpaper = (preset: WallpaperPreset) => {
    onChangeSettings({
      ...settings,
      wallpaper: preset,
    });
  };

  const handleToggleSound = () => {
    onChangeSettings({
      ...settings,
      soundEnabled: !settings.soundEnabled,
    });
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden text-black font-sans bg-[#c0c0c0]" id="app-settings">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-36 border-b md:border-b-0 md:border-r border-[#808080] p-1.5 flex flex-row md:flex-col gap-1 shrink-0 overflow-x-auto select-none">
        <button
          onClick={() => setActiveTab("wallpaper")}
          className={`px-3 py-1.5 hover:bg-[#000080] hover:text-white rounded text-left text-xs flex items-center gap-1 cursor-default shrink-0 ${
            activeTab === "wallpaper" ? "bg-[#000080] text-white" : ""
          }`}
        >
          <Monitor size={12} />
          <span>Desktop Theme</span>
        </button>

        <button
          onClick={() => setActiveTab("sounds")}
          className={`px-3 py-1.5 hover:bg-[#000080] hover:text-white rounded text-left text-xs flex items-center gap-1 cursor-default shrink-0 ${
            activeTab === "sounds" ? "bg-[#000080] text-white" : ""
          }`}
        >
          <Volume2 size={12} />
          <span>Sound Card</span>
        </button>

        <button
          onClick={() => setActiveTab("screensaver")}
          className={`px-3 py-1.5 hover:bg-[#000080] hover:text-white rounded text-left text-xs flex items-center gap-1 cursor-default shrink-0 ${
            activeTab === "screensaver" ? "bg-[#000080] text-white" : ""
          }`}
        >
          <Sliders size={12} />
          <span>Screensaver</span>
        </button>

        <button
          onClick={() => setActiveTab("diagnostic")}
          className={`px-3 py-1.5 hover:bg-[#000080] hover:text-white rounded text-left text-xs flex items-center gap-1 cursor-default shrink-0 ${
            activeTab === "diagnostic" ? "bg-[#000080] text-white" : ""
          }`}
        >
          <ShieldAlert size={12} />
          <span>Diagnostics</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 min-w-0 p-3 overflow-y-auto flex flex-col justify-between h-full">
        <div className="flex-1 min-h-0">
          
          {/* Wallpaper Selection */}
          {activeTab === "wallpaper" && (
            <div className="space-y-4">
              <div className="border-b border-[#808080] pb-1">
                <h3 className="font-bold text-xs flex items-center gap-1">
                  <Monitor size={14} className="text-blue-800" />
                  <span>CUSTOM SYSTEM BACKGROUND WALLPAPER</span>
                </h3>
                <p className="text-[10px] text-gray-500 mt-1">Transform the graphic layout of your screen immediately.</p>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {wallpapers.map((w) => (
                  <button
                    key={w.preset}
                    onClick={() => handleSelectWallpaper(w.preset)}
                    className={`retro-border-outset p-2 text-left hover:bg-gray-100 flex items-start gap-2 relative ${
                      settings.wallpaper === w.preset ? "bg-[#dfdfdf] border-t-[#808080] border-l-[#808080] border-r-white border-b-white" : ""
                    }`}
                  >
                    <div className={`w-9 h-9 border border-gray-400 shrink-0 ${w.color}`} />
                    <div className="truncate">
                      <div className="text-[11.5px] font-bold truncate">{w.name}</div>
                      <div className="text-[9px] text-gray-600 truncate">{w.desc}</div>
                    </div>
                    {settings.wallpaper === w.preset && (
                      <span className="absolute right-1.5 top-1.5 text-[9px] text-blue-900 font-mono font-bold uppercase select-none">
                        Active
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sound Settings */}
          {activeTab === "sounds" && (
            <div className="space-y-4">
              <div className="border-b border-[#808080] pb-1">
                <h3 className="font-bold text-xs flex items-center gap-1">
                  <Volume2 size={14} className="text-blue-800" />
                  <span>SYSTEM AUDIO & AUDIO DRIVERS</span>
                </h3>
                <p className="text-[10px] text-gray-500 mt-1">Configure audio synthesizer alerts card.</p>
              </div>

              <div className="bg-gray-50 retro-border-inset p-3 max-w-[320px] space-y-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={handleToggleSound}
                    className="accent-[#000080]"
                  />
                  <span className="text-xs font-bold">Enable Chiptune Speaker Beeps</span>
                </label>
                <p className="text-[10px] text-gray-500 leading-relaxed pl-5">
                  When enabled, boot sequences and button interactions perform classic soundcard bios clicks.
                </p>
              </div>

              <div className="flex items-start gap-1 p-2 bg-amber-50 retro-border-inset max-w-[320px]">
                <ShieldAlert size={16} className="text-amber-800 shrink-0 mt-0.5" />
                <span className="text-[9.5px] text-stone-700 leading-normal">
                  Note: gemstoneOS synthesizer is fully standards-compliant with direct Web Audio synthesizers. No plugins required.
                </span>
              </div>
            </div>
          )}

          {/* Screensaver panel */}
          {activeTab === "screensaver" && (
            <div className="space-y-4">
              <div className="border-b border-[#808080] pb-1">
                <h3 className="font-bold text-xs flex items-center gap-1">
                  <Sliders size={14} className="text-blue-800" />
                  <span>3D SCI-FI PIPES SCREENSAVER ENGINE</span>
                </h3>
                <p className="text-[10px] text-gray-500 mt-1">Protect monitor phosphorus from burn-in damage.</p>
              </div>

              <div className="space-y-3 max-w-[320px]">
                <div className="flex flex-col gap-1 bg-white retro-border-inset p-2">
                  <label className="text-[11px] font-bold text-gray-700">Type of Screen Projection:</label>
                  <select
                    value={settings.screensaverType}
                    onChange={(e) => onChangeSettings({ ...settings, screensaverType: e.target.value as any })}
                    className="retro-border-outset h-[24px] px-1 bg-[#c0c0c0] outline-none border cursor-default text-xs mt-1"
                  >
                    <option value="pipes">Classic 3D Neon Pipes</option>
                    <option value="starfield">Starfield Simulation (56k Warpspeed)</option>
                    <option value="gem_bounce">Bounding Volcanic Gems</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 bg-white retro-border-inset p-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-gray-700">
                    <span>IDLE DELAY TIMEOUT:</span>
                    <span className="text-blue-900 font-mono font-semibold">{settings.screensaverTimeout} seconds</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="180"
                    step="10"
                    value={settings.screensaverTimeout}
                    onChange={(e) => onChangeSettings({ ...settings, screensaverTimeout: parseInt(e.target.value) })}
                    className="cursor-pointer accent-[#000080] w-full"
                  />
                  <div className="text-[9px] text-gray-500 mt-1">Screensaver fires automatically when user remains idle.</div>
                </div>

                <button
                  type="button"
                  onClick={onPreviewScreensaver}
                  className="retro-button w-full !py-1.5 flex items-center justify-center gap-1"
                >
                  <Play size={11} className="fill-current" />
                  <span>Preview Screensaver Now</span>
                </button>
              </div>
            </div>
          )}

          {/* Diagnostics Panel */}
          {activeTab === "diagnostic" && (
            <div className="space-y-4">
              <div className="border-b border-[#808080] pb-1">
                <h3 className="font-bold text-xs flex items-center gap-1">
                  <ShieldAlert size={14} className="text-red-800" />
                  <span>HARDWARE DIAGNOSTICS & RETRO CRASH UTILITY</span>
                </h3>
                <p className="text-[10px] text-gray-500 mt-1">Simulate unstable vintage hardware events for nostalgic purposes.</p>
              </div>

              <div className="bg-red-50 p-3 retro-border-inset max-w-[320px] space-y-3">
                <p className="text-[10.5px] text-red-950 font-semibold leading-relaxed">
                  Vintage operating systems were highly specialty drivers prone to sudden microchip address collisions, generating the iconic blue screen error interface.
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={onTriggerBsod}
                    className="retro-button !bg-red-800 !text-white hover:!bg-red-700 font-bold text-xs w-full py-1.5 text-center flex items-center justify-center gap-1"
                  >
                    <span>Simulate Fatal BSOD Crash</span>
                  </button>
                  <p className="text-[9px] text-stone-600 pl-1 leading-normal">
                    This triggers a simulated 16-Bit GemCore hardware interrupt immediately, bringing up the blue screen diagnostics deck.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Brand signature */}
        <div className="mt-4 border-t border-[#808080] pt-2 text-[10px] text-gray-500 text-right pr-1 shrink-0 font-mono">
          SYSTEMS_CONTROL_PANEL v1.02
        </div>
      </div>
    </div>
  );
}
