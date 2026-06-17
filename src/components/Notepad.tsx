import React, { useState, useEffect } from "react";
import { Save, FilePlus, Download, Trash, ChevronRight } from "lucide-react";

interface SavedNote {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export default function Notepad() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled Document");
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");

  useEffect(() => {
    const saved = localStorage.getItem("gemstoneOS_notes");
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveNotesToStorage = (updatedNotes: SavedNote[]) => {
    localStorage.setItem("gemstoneOS_notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const handleCreateNew = () => {
    setTitle("Untitled Document");
    setContent("");
    setSelectedNoteId(null);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    let updated: SavedNote[];
    const now = new Date().toLocaleString();
    
    if (selectedNoteId) {
      updated = notes.map((note) =>
        note.id === selectedNoteId
          ? { ...note, title, content, updatedAt: now }
          : note
      );
    } else {
      const newNote: SavedNote = {
        id: Math.random().toString(36).substring(2, 9),
        title,
        content,
        updatedAt: now,
      };
      updated = [newNote, ...notes];
      setSelectedNoteId(newNote.id);
    }
    
    saveNotesToStorage(updated);
  };

  const handleSelectNote = (note: SavedNote) => {
    setSelectedNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notes.filter((n) => n.id !== id);
    saveNotesToStorage(updated);
    if (selectedNoteId === id) {
      handleCreateNew();
    }
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(/\s+/g, "_") || "doc"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case "sm": return "text-xs";
      case "lg": return "text-base";
      case "xl": return "text-lg";
      default: return "text-sm";
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden text-black font-sans bg-[#c0c0c0]" id="app-notepad">
      {/* File Drawer - Saved Notes List */}
      <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-[#808080] p-2 flex flex-col min-h-[110px] md:min-h-0 shrink-0">
        <div className="text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
          <span>SAVED DOCUMENTS</span>
          <button
            onClick={handleCreateNew}
            className="retro-button !py-0.5 !px-1.5 flex items-center gap-1 active:scale-[0.98]"
          >
            <FilePlus size={10} />
            <span>New</span>
          </button>
        </div>

        <div className="flex-1 bg-white retro-border-inset overflow-y-auto max-h-[80px] md:max-h-none p-1 flex flex-row md:flex-col gap-1 md:gap-0 select-none">
          {notes.length === 0 ? (
            <div className="text-[10px] text-gray-500 p-2 italic w-full">No documents saved in system registry yet.</div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                onClick={() => handleSelectNote(note)}
                className={`flex items-center justify-between p-1 cursor-default text-[11px] font-sans truncate shrink-0 w-36 md:w-full border-r md:border-r-0 md:border-b border-[#dfdfdf] ${
                  selectedNoteId === note.id ? "bg-[#000080] text-white" : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-1 truncate max-w-[80%]">
                  <ChevronRight size={10} className="shrink-0" />
                  <span className="truncate">{note.title}</span>
                </div>
                <button
                  onClick={(e) => handleDelete(note.id, e)}
                  className="hover:bg-red-700 hover:text-white p-[2px] rounded shrink-0"
                >
                  <Trash size={10} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="flex-1 flex flex-col min-w-0 p-2 h-full">
        {/* Editor Settings Topbar */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2 shrink-0">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="retro-input flex-1 min-w-[120px] !font-sans !font-semibold text-xs !bg-gray-50 hover:!bg-white"
            placeholder="Document Name"
            title="Edit Document Title"
          />

          <div className="flex items-center gap-1">
            {/* Font Size Adjuster */}
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value as any)}
              className="retro-border-outset h-[22px] px-1 text-[11px] bg-[#c0c0c0] outline-none border cursor-default"
              title="Font Size"
            >
              <option value="sm">Small Text</option>
              <option value="base">Normal Text</option>
              <option value="lg">Medium Text</option>
              <option value="xl">Large Text</option>
            </select>

            <button
              onClick={handleSave}
              className="retro-button !py-1 flex items-center gap-1"
              title="Save to Desktop Registry"
            >
              <Save size={12} />
              <span>Save</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              disabled={!content}
              className="retro-button !py-1 flex items-center gap-1"
              title="Download TXT file"
            >
              <Download size={12} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Text Area Input */}
        <div className="flex-1 min-h-0 flex flex-col relative w-full">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`flex-1 w-full h-full resize-none retro-input p-3 overflow-y-auto leading-relaxed focus:bg-white select-text ${getFontSizeClass()}`}
            placeholder="Begin typing gemstoneOS 98 Jan Mayen journal entries or workspace logs here..."
            style={{ fontFamily: fontSize === "sm" ? "var(--font-sans)" : "var(--font-mono)" }}
          />
        </div>

        {/* Info Line */}
        <div className="mt-1 flex items-center justify-between text-[11px] text-gray-600 px-1 font-mono">
          <span>Characters: {content.length}</span>
          <span>SYSTEM: GemText v1.98</span>
        </div>
      </div>
    </div>
  );
}
