import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, Music, Volume2, VolumeX, FastForward, Info } from "lucide-react";

interface Song {
  title: string;
  artist: string;
  genre: string;
  notes: { note: string; duration: number }[];
  tempo: number;
}

export default function GemTune() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [activeNoteName, setActiveNoteName] = useState<string>("-");
  const [songProgress, setSongProgress] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const noteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentNoteIndexRef = useRef(0);

  const songs: Song[] = [
    {
      title: "Crystal Geode",
      artist: "GemCore MIDI Band",
      genre: "Chiptune / Geode Synth",
      tempo: 120,
      notes: [
        { note: "C4", duration: 1 }, { note: "E4", duration: 1 }, { note: "G4", duration: 1 }, { note: "C5", duration: 1 },
        { note: "E5", duration: 1 }, { note: "C5", duration: 1 }, { note: "G4", duration: 1 }, { note: "E4", duration: 1 },
        { note: "F4", duration: 1 }, { note: "A4", duration: 1 }, { note: "C5", duration: 1 }, { note: "F5", duration: 1 },
        { note: "C5", duration: 1 }, { note: "A4", duration: 1 }, { note: "F4", duration: 1 }, { note: "G4", duration: 2 },
        { note: "B4", duration: 1 }, { note: "D5", duration: 1 }, { note: "G5", duration: 2 }, { note: "D5", duration: 1 },
        { note: "B4", duration: 1 }, { note: "C5", duration: 4 }
      ]
    },
    {
      title: "Ode to Joy (Mineral Mix)",
      artist: "L. Beethoven (97)",
      genre: "Retro Classical",
      tempo: 140,
      notes: [
        { note: "E4", duration: 1 }, { note: "E4", duration: 1 }, { note: "F4", duration: 1 }, { note: "G4", duration: 1 },
        { note: "G4", duration: 1 }, { note: "F4", duration: 1 }, { note: "E4", duration: 1 }, { note: "D4", duration: 1 },
        { note: "C4", duration: 1 }, { note: "C4", duration: 1 }, { note: "D4", duration: 1 }, { note: "E4", duration: 1 },
        { note: "E4", duration: 1.5 }, { note: "D4", duration: 0.5 }, { note: "D4", duration: 2 },
        { note: "E4", duration: 1 }, { note: "E4", duration: 1 }, { note: "F4", duration: 1 }, { note: "G4", duration: 1 },
        { note: "G4", duration: 1 }, { note: "F4", duration: 1 }, { note: "E4", duration: 1 }, { note: "D4", duration: 1 },
        { note: "C4", duration: 1 }, { note: "C4", duration: 1 }, { note: "D4", duration: 1 }, { note: "E4", duration: 1 },
        { note: "D4", duration: 1.5 }, { note: "C4", duration: 0.5 }, { note: "C4", duration: 2 }
      ]
    },
    {
      title: "Space Mines Theme",
      artist: "Retro Volcanic Soundcard",
      genre: "Arcade Beep Core",
      tempo: 160,
      notes: [
        { note: "A4", duration: 0.5 }, { note: "A4", duration: 0.5 }, { note: "E5", duration: 1 }, { note: "D5", duration: 0.5 },
        { note: "C5", duration: 0.5 }, { note: "B4", duration: 1 }, { note: "G4", duration: 0.5 }, { note: "G4", duration: 0.5 },
        { note: "D5", duration: 1 }, { note: "C5", duration: 0.5 }, { note: "B4", duration: 0.5 }, { note: "A4", duration: 2 },
        { note: "A4", duration: 0.5 }, { note: "A4", duration: 0.5 }, { note: "E5", duration: 1 }, { note: "D5", duration: 0.5 },
        { note: "C5", duration: 0.5 }, { note: "B4", duration: 1 }, { note: "G4", duration: 0.5 }, { note: "G4", duration: 0.5 },
        { note: "D5", duration: 1 }, { note: "C5", duration: 0.5 }, { note: "B4", duration: 0.5 }, { note: "A4", duration: 2 }
      ]
    }
  ];

  const noteFreqs: { [key: string]: number } = {
    "C4": 261.63, "C#4": 277.18, "D4": 293.66, "D#4": 311.13, "E4": 329.63, "F4": 349.23, "F#4": 369.99,
    "G4": 392.00, "G#4": 415.30, "A4": 440.00, "A#4": 466.16, "B4": 493.88,
    "C5": 523.25, "C#5": 554.37, "D5": 587.33, "D#5": 622.25, "E5": 659.25, "F5": 698.46, "F#5": 739.99,
    "G5": 783.99, "G#5": 830.61, "A5": 880.00, "A#5": 932.33, "B5": 987.77
  };

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playChiptuneNote = (freq: number, durationSec: number) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Use a nostalgic Square oscillator wave (classic Nintendo / DOS chiptune sound)
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "triangle"; // Nice soft 1997 game synthesizer tone
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Dynamic volume gain envelope for vintage decay
    const activeVolume = isMuted ? 0 : volume;
    // Web Audio exponential ramp target and start values MUST be strictly positive (>0)
    const startVolume = Math.max(0.0001, activeVolume);
    const targetTime = ctx.currentTime + Math.max(0.02, durationSec - 0.02);

    try {
      gainNode.gain.setValueAtTime(startVolume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, targetTime);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + Math.max(0.03, durationSec));
    } catch (e) {
      // Catch any audio errors gracefully
      console.warn("Audio node playback error:", e);
    }
  };

  const playNextNote = () => {
    const song = songs[currentSongIndex];
    if (currentNoteIndexRef.current >= song.notes.length) {
      // Loop song
      currentNoteIndexRef.current = 0;
    }

    const { note, duration } = song.notes[currentNoteIndexRef.current];
    const freq = noteFreqs[note];
    
    // Duration in seconds depending on tempo
    const beatDuration = 60 / song.tempo;
    const durationSeconds = duration * beatDuration;

    setActiveNoteName(note);
    if (freq) {
      playChiptuneNote(freq, durationSeconds);
    }

    setSongProgress((currentNoteIndexRef.current / song.notes.length) * 100);

    // Schedule next note
    noteTimeoutRef.current = setTimeout(() => {
      currentNoteIndexRef.current++;
      playNextNote();
    }, durationSeconds * 1000);
  };

  const startPlaying = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    getAudioContext();
    playNextNote();
  };

  const stopPlaying = () => {
    setIsPlaying(false);
    setActiveNoteName("-");
    setSongProgress(0);
    if (noteTimeoutRef.current) {
      clearTimeout(noteTimeoutRef.current);
      noteTimeoutRef.current = null;
    }
    currentNoteIndexRef.current = 0;
  };

  const handleNextSong = () => {
    stopPlaying();
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    setTimeout(() => {
      // Small tick for replaying
      setIsPlaying(false);
    }, 100);
  };

  // Sync index on mounting
  useEffect(() => {
    return () => {
      if (noteTimeoutRef.current) clearTimeout(noteTimeoutRef.current);
    };
  }, []);

  const song = songs[currentSongIndex];

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-3 select-none text-black font-sans bg-[#c0c0c0]" id="app-mediaplayer">
      
      {/* Tape Tape deck / Cassette simulator layout */}
      <div className="retro-border-inset bg-[#202025] text-emerald-400 p-3 rounded w-full max-w-[340px] shadow-inner shrink-0 relative overflow-hidden flex flex-col gap-2">
        <div className="absolute right-2 top-2 w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse border border-red-400" title="Tape Live Recording" />

        {/* LED stats screen */}
        <div className="border border-[#3a3a45] bg-[#121215] p-2 rounded flex flex-col">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[#60ff60] font-bold">16-BIT AUDIO CORE DECK</div>
          <div className="text-[13px] font-semibold text-white truncate leading-relaxed mt-1">{song.title}</div>
          <div className="text-[10px] text-gray-400 truncate font-mono">{song.artist} — {song.genre}</div>

          {/* Graphical Note feedback */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#202025]">
            <div className="flex items-end gap-[2.5px] h-6 flex-1 pr-3">
              {[...Array(14)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: isPlaying ? `${Math.floor(Math.random() * 20) + 4}px` : "3px",
                    transition: "height 0.12s ease"
                  }}
                  className="w-1 bg-[#60ff60] shrink-0"
                />
              ))}
            </div>

            <div className="text-center rounded shrink-0 bg-[#252528] px-2.5 py-0.5 border border-gray-800 font-mono text-xs text-[#a0ffa0]">
              Note: <span className="font-bold underline">{activeNoteName}</span>
            </div>
          </div>
        </div>

        {/* Music progression bar */}
        <div className="w-full bg-[#1e1e24] h-[6px] border border-gray-800 relative rounded-sm overflow-hidden mt-1">
          <div
            style={{ width: `${songProgress}%` }}
            className="h-full bg-emerald-500 rounded-sm transition-all duration-300"
          />
        </div>
      </div>

      {/* Retro hardware button grid */}
      <div className="w-full max-w-[340px] flex flex-wrap items-center justify-between gap-1 mt-3.5 shrink-0">
        <div className="flex items-center gap-1">
          {isPlaying ? (
            <button
              onClick={stopPlaying}
              className="retro-button !py-1.5 !px-3.5 flex items-center gap-1.5 active:scale-95 text-red-800"
              title="Stop Sequencer"
            >
              <Square size={11} className="fill-current" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={startPlaying}
              className="retro-button !py-1.5 !px-4 flex items-center gap-1.5 active:scale-95 text-emerald-800"
              title="Start Playback"
            >
              <Play size={11} className="fill-current" />
              <span>Play</span>
            </button>
          )}

          <button
            onClick={handleNextSong}
            className="retro-button !py-1.5 !px-3 flex items-center gap-1.5 active:scale-95"
            title="Next Chiptune Song"
          >
            <FastForward size={11} />
            <span>Next</span>
          </button>
        </div>

        {/* Dynamic audio volume slider */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsMuted((prev) => !prev)}
            className="retro-button !p-1.5"
            title={isMuted ? "Unmute Tones" : "Mute Tones"}
          >
            {isMuted ? <VolumeX size={12} className="text-red-700" /> : <Volume2 size={12} className="text-blue-800" />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-14 cursor-pointer accent-[#000080]"
            title="Solenoid Core Volume"
          />
        </div>
      </div>

      {/* Card manual specs */}
      <div className="text-[10.5px] font-sans text-stone-600 bg-amber-50 retro-border-inset p-2 mt-4 max-w-[340px] shrink-0 font-medium leading-relaxed">
        <div className="font-extrabold text-[#000080] flex items-center gap-1 mb-1">
          <Info size={11} />
          <span>REAL SYNTH ENGINE INSTRUCTIONS</span>
        </div>
        <span>Plays authentic synthesized soundwaves using your browser's vintage oscillators. Golly! Hit play and customize notes live.</span>
      </div>
    </div>
  );
}
