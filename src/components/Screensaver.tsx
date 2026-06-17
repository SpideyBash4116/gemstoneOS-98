import React, { useEffect, useRef } from "react";

interface ScreensaverProps {
  type: "pipes" | "starfield" | "gem_bounce";
  onClose: () => void;
}

export default function Screensaver({ type, onClose }: ScreensaverProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // ------------------------------------------
    // 1. Classic 3D Neon Pipes
    // ------------------------------------------
    const pipes: { x: number; y: number; dir: number; color: string; width: number }[] = [];
    const pipeColors = ["#ff0055", "#00ffcc", "#ffcc00", "#9900ff", "#33ff34", "#ff5500"];
    
    const initPipes = () => {
      for (let i = 0; i < 4; i++) {
        pipes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dir: Math.floor(Math.random() * 4), // 0: up, 1: right, 2: down, 3: left
          color: pipeColors[Math.floor(Math.random() * pipeColors.length)],
          width: Math.floor(Math.random() * 6) + 6,
        });
      }
    };

    if (type === "pipes") {
      initPipes();
      // Start black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const drawPipes = () => {
      // Draw trails
      pipes.forEach((p) => {
        ctx.beginPath();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.width;
        ctx.lineCap = "round";
        ctx.moveTo(p.x, p.y);

        const step = 20;
        // Move pipe
        if (p.dir === 0) p.y -= step;
        else if (p.dir === 1) p.x += step;
        else if (p.dir === 2) p.y += step;
        else if (p.dir === 3) p.x -= step;

        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Bounds checks / change direction randomly
        if (
          Math.random() < 0.15 ||
          p.x < 0 ||
          p.x > canvas.width ||
          p.y < 0 ||
          p.y > canvas.height
        ) {
          // Bounce or wrap
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          p.dir = Math.floor(Math.random() * 4);
        }
      });
    };

    // ------------------------------------------
    // 2. Starfield Simulation (Warpspeed)
    // ------------------------------------------
    const stars: { x: number; y: number; z: number }[] = [];
    const maxStars = 180;
    for (let i = 0; i < maxStars; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
      });
    }

    const drawStarfield = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      stars.forEach((s) => {
        s.z -= 8; // Warp speed velocity
        if (s.z <= 0) {
          s.z = canvas.width;
          s.x = Math.random() * canvas.width - canvas.width / 2;
          s.y = Math.random() * canvas.height - canvas.height / 2;
        }

        const px = (s.x / s.z) * cx + cx;
        const py = (s.y / s.z) * cy + cy;

        if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
          const size = ((canvas.width - s.z) / canvas.width) * 4;
          const brightness = Math.floor(((canvas.width - s.z) / canvas.width) * 255);
          ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.5, size), 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    // ------------------------------------------
    // 3. Bounding Volcanic Gems
    // ------------------------------------------
    const gems: { x: number; y: number; dx: number; dy: number; size: number; color: string; label: string }[] = [];
    const gemEmojis = ["💎", "🔮", "🌋", "✨", "⭐"];
    const colors = ["#ff00ff", "#00ffff", "#ffff00", "#ff0000", "#00ff00"];

    for (let i = 0; i < 15; i++) {
      gems.push({
        x: Math.random() * (canvas.width - 60) + 30,
        y: Math.random() * (canvas.height - 60) + 30,
        dx: (Math.random() - 0.5) * 4 + 2,
        dy: (Math.random() - 0.5) * 4 + 2,
        size: Math.floor(Math.random() * 20) + 24,
        color: colors[Math.floor(Math.random() * colors.length)],
        label: gemEmojis[Math.floor(Math.random() * gemEmojis.length)],
      });
    }

    const drawGemBounce = () => {
      ctx.fillStyle = "#0c0a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.font = "italic bold 18px monospace";
      ctx.fillText("gemstoneOS 98 Jan Mayen Systems Safeguard Active", 20, 40);

      gems.forEach((g) => {
        g.x += g.dx;
        g.y += g.dy;

        // Wall collisions
        if (g.x < 0 || g.x + g.size > canvas.width) g.dx *= -1;
        if (g.y < 0 || g.y + g.size > canvas.height) g.dy *= -1;

        ctx.font = `${g.size}px sans-serif`;
        ctx.fillText(g.label, g.x, g.y + g.size);
      });
    };

    // Main render scheduler loop
    const tick = () => {
      if (type === "pipes") {
        drawPipes();
      } else if (type === "starfield") {
        drawStarfield();
      } else if (type === "gem_bounce") {
        drawGemBounce();
      }
      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [type]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] bg-black cursor-none select-none overflow-hidden"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute bottom-5 right-5 text-[10px] text-gray-500 font-mono pointer-events-none uppercase">
        Press or click anywhere to restore desktop sequence
      </div>
    </div>
  );
}
