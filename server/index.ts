import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { chatHandler } from "./chat";
import { knowledgeLoader } from "./knowledge";

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

// CORS: restrict to allowed origins (comma-separated in env, defaults to localhost)
const allowedOrigins = (process.env.CORS_ORIGINS || `http://localhost:${PORT}`)
  .split(",")
  .map((o) => o.trim());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "50kb" }));

// Rate limit chat endpoint: 30 requests per minute per IP
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Load knowledge files on startup
const knowledge = knowledgeLoader();

// Chat endpoint
app.post("/api/chat", chatLimiter, (req, res) => chatHandler(req, res, knowledge));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", mode: "ai", knowledgeEntries: knowledge.length });
});

app.listen(PORT, () => {
  console.log(`🤖 EasyChat AI server running on http://localhost:${PORT}`);
  console.log(`   Knowledge entries loaded: ${knowledge.length}`);
  console.log(`   Chat endpoint: POST http://localhost:${PORT}/api/chat`);
});
