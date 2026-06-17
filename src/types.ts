export type AppType = 
  | "my_computer"
  | "gemmy"
  | "minesweeper"
  | "paint"
  | "media_player"
  | "clicker"
  | "control_panel"
  | "notepad"
  | "run"
  | "internet"
  | "welcome"
  | "calculator";

export interface WindowItem {
  id: string; // usually same as AppType
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minWidth?: number;
  minHeight?: number;
}

export interface DesktopIcon {
  id: AppType;
  label: string;
  iconName: string; // name of Lucide icon to use
  color: string; // colors for nostalgic layout
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

export interface UpgradeItem {
  id: string;
  name: string;
  cost: number;
  gps: number; // Gemstones Per Second added
  count: number;
  icon: string;
  description: string;
}

export type WallpaperPreset = 
  | "teal" 
  | "gradient-sunset" 
  | "hot-pink" 
  | "win95-classic" 
  | "space-stars" 
  | "lavender"
  | "retro-brick";

export interface SystemSettings {
  wallpaper: WallpaperPreset;
  soundEnabled: boolean;
  screensaverTimeout: number; // in seconds
  screensaverType: "pipes" | "starfield" | "gem_bounce";
  isShutDown: boolean;
}
