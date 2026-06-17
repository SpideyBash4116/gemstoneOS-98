import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GoogleGenAI client to avoid startup crashes if key is somehow missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Chat functions will be disabled.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Retro AI assistant endpoint
app.post("/api/gemmy", async (req, res) => {
  try {
    const { prompt, history } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: "Gemini API is not configured on the server. Please add your GEMINI_API_KEY in the Secrets panel.",
      });
    }

    const systemInstruction = 
      "You are 'Gemmy', the virtual desktop companion for gemstoneOS 98 Jan Mayen (a premium, nostalgic operating system mockup released in late 1998). " +
      "You are a floating, brilliant mineral crystal with cute cartoon eyes. " +
      "Your tone is incredibly helpful, overly enthusiastic, and filled with late-90s technical terms. " +
      "Refer to brand-new features like our 3D pipe screensavers, high-speed 56k dial-up web capabilities, high-fidelity Web Audio sound chips, customizable wallpaper presets, and mineral-digging software. " +
      "Keep responses highly conversational, delightful, and quite short (fewer than 13k tokens or around 100-140 words maximum) so they fit nicely in a dialogue scroll. " +
      "Use nostalgic computing jargon like 'Information Superhighway', 'CD-ROM drive speed', 'floppy disks', 'Pentium hardware', '32-bit architecture', and 'Golly!' or 'Super-duper!'. " +
      "Do NOT use heavy markdown styling like H1, H2, or bullets. Use clean, plain paragraph prose so it reads like a friendly desktop wizard.";

    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        formattedContents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.text }],
        });
      }
    }
    formattedContents.push({
      role: "user",
      parts: [{ text: prompt || "Hello Gemmy!" }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.9,
      },
    });

    const reply = response.text || "Golly! My cognitive mineral chips experienced a brief delay. Let's try that command again!";
    res.json({ text: reply });
  } catch (error: any) {
    console.error("Error communicating with Gemini:", error);
    res.status(500).json({ error: error.message || "Internal Server Error in core processors" });
  }
});

// Applet Health / Metadata endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    system: "gemstoneOS 98 Jan Mayen",
    uptime: process.uptime(),
    processors: "16-bit GemCore v2.4",
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[gemstoneOS] Core boot sequencing complete. Operating on port ${PORT}`);
  });
}

startServer();
