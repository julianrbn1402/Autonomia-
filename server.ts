import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

// Simple file logging to see if server starts in dev environment
fs.writeFileSync("server-debug.log", "Server script loaded at " + new Date().toISOString() + "\n", { flag: "a" });

async function startServer() {
  fs.writeFileSync("server-debug.log", "startServer() called at " + new Date().toISOString() + "\n", { flag: "a" });
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // API endpoint for QnA with Gemini
  app.post("/api/qna", async (req, res): Promise<any> => {
    fs.writeFileSync("server-debug.log", "POST /api/qna received at " + new Date().toISOString() + "\n", { flag: "a" });
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        fs.writeFileSync("server-debug.log", "ERROR: Invalid payload\n", { flag: "a" });
        return res.status(400).json({ error: "Invalid request payload. 'messages' array is required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        fs.writeFileSync("server-debug.log", "ERROR: GEMINI_API_KEY is missing\n", { flag: "a" });
        return res.status(500).json({ 
          error: "GEMINI_API_KEY is not configured in the developer environment. Please set GEMINI_API_KEY in the Settings > Secrets panel." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Translate client messages to Gemini contents structure
      const contents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : m.role || "user",
        parts: [{ text: m.content || "" }]
      }));

      fs.writeFileSync("server-debug.log", `Calling model gemini-3.5-flash with ${contents.length} messages\n`, { flag: "a" });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: "You are AUTONOMIA AI, an expert Indonesian mining AI assistant for coal mining operations. You help operators, managers, and planners analyze loaders' Match Factors, cycle time targets, delay times, and road conditions based on calculations on the screen. Be insightful, concise, highly professional, and encouraging. Address the user in Indonesian in a support-engineer tone. If the user asks about the dashboard calculations (like Match Factor or delay CS), provide accurate mining advice.",
        }
      });

      fs.writeFileSync("server-debug.log", `Received API response: ${response.text ? response.text.substring(0, 30) + "..." : "empty"}\n`, { flag: "a" });

      return res.json({ reply: response.text || "No response generated." });
    } catch (error: any) {
      fs.writeFileSync("server-debug.log", `CATCH ERROR: ${error.message}\n`, { flag: "a" });
      console.error("Gemini QnA API error:", error);
      return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
