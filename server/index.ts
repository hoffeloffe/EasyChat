import express from "express";
import cors from "cors";
import { chatHandler } from "./chat";
import { knowledgeLoader } from "./knowledge";

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

app.use(cors());
app.use(express.json());

// Load knowledge files on startup
const knowledge = knowledgeLoader();

// Chat endpoint
app.post("/api/chat", (req, res) => chatHandler(req, res, knowledge));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", mode: "ai", knowledgeEntries: knowledge.length });
});

app.listen(PORT, () => {
  console.log(`🤖 EasyChat AI server running on http://localhost:${PORT}`);
  console.log(`   Knowledge entries loaded: ${knowledge.length}`);
  console.log(`   Chat endpoint: POST http://localhost:${PORT}/api/chat`);
});
