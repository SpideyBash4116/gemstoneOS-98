import { useCallback } from "react";

// Cache AudioContext instance globally across hook calls to bypass browser limit of active contexts
let globalAudioCtx: AudioContext | null = null;

export function useSystemSounds(soundEnabled: boolean = true) {
  // Helper to safely get AudioContext
  const getAudioContext = useCallback((): AudioContext | null => {
    try {
      if (!globalAudioCtx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return null;
        globalAudioCtx = new AudioCtx();
      }
      if (globalAudioCtx.state === "suspended") {
        globalAudioCtx.resume();
      }
      return globalAudioCtx;
    } catch {
      return null;
    }
  }, []);

  // 1. CLICK / TAP SOUND - Short, high-register crisp sound
  const playClick = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio execution safe fail
    }
  }, [soundEnabled, getAudioContext]);

  // 2. ERROR CHORD - Nostalgic two-tone discordant buzzer
  const playError = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const freqs = [150, 220, 290];
      const now = ctx.currentTime;
      
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        
        gain.gain.setValueAtTime(0.0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.5);
      });
    } catch {
      // Audio execution safe fail
    }
  }, [soundEnabled, getAudioContext]);

  // 3. STARTUP CHIME - Retro MIDI/FM synthesis emulation, warm polyphonic arpeggios
  const playStartup = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      // Classic ascending synthesizer major progression: C4, E4, G4, C5, E5
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Classic custom synthesizer: mixed triangle and sine wave flavors
        osc.type = idx % 2 === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.04, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch {
      // Audio execution safe fail
    }
  }, [soundEnabled, getAudioContext]);

  // 4. SHUTDOWN CHIME - Classic decelerating pitch series
  const playShutdown = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      // Descending scale sequence
      const notes = [523.25, 392.00, 329.63, 261.63];
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.5);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.55);
      });
    } catch {
      // Audio execution safe fail
    }
  }, [soundEnabled, getAudioContext]);

  // 5. WINDOW MINIMIZE SWEEP - Rapid downward pitch sweep
  const playMinimize = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.22);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
    } catch {
      // Audio execution safe fail
    }
  }, [soundEnabled, getAudioContext]);

  // 6. WINDOW MAXIMIZE SWEEP - Rapid upward pitch sweep
  const playMaximize = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.22);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
    } catch {
      // Audio execution safe fail
    }
  }, [soundEnabled, getAudioContext]);

  // 7. ASTERISK / EXCLAMATION INFO CHIME - Bright sparkling major 7th chord
  const playInfo = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 830.61]; // A standard major 7th vibe
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.03, now + idx * 0.05 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.35);
      });
    } catch {
      // Audio execution safe fail
    }
  }, [soundEnabled, getAudioContext]);

  return {
    playClick,
    playError,
    playStartup,
    playShutdown,
    playMinimize,
    playMaximize,
    playInfo,
  };
}
