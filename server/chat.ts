import type { Request, Response } from "express";
import OpenAI from "openai";
import type { KnowledgeEntry } from "./knowledge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatRequest {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

/**
 * Handle AI chat requests.
 * Uses knowledge base entries as context for the AI to ground its responses.
 */
export async function chatHandler(
  req: Request,
  res: Response,
  knowledge: KnowledgeEntry[]
): Promise<void> {
  try {
    const { message, history = [] } = req.body as ChatRequest;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    // Sanitize history: only allow valid roles and string content
    const safeHistory = (Array.isArray(history) ? history : [])
      .filter(
        (m): m is { role: "user" | "assistant"; content: string } =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

    if (!process.env.OPENAI_API_KEY) {
      res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
      return;
    }

    // Build context from knowledge base
    const context = buildContext(message, knowledge);

    const systemPrompt = `You are a helpful customer support chatbot. Be friendly, concise, and helpful.

${context ? `Use the following knowledge base to answer questions. Only use this information - do not make things up:

${context}` : "No knowledge base is loaded. Answer general questions helpfully, but let the user know you don't have specific information about their product/service."}

If you don't know the answer, be honest and suggest the user contact human support.
Keep responses under 150 words.`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...safeHistory.slice(-8).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    res.json({ message: reply });
  } catch (err) {
    console.error("[EasyChat] Chat error:", err);
    res.status(500).json({ error: "Failed to generate response" });
  }
}

/**
 * Find relevant knowledge entries and build a context string for the AI.
 */
function buildContext(query: string, knowledge: KnowledgeEntry[]): string {
  if (knowledge.length === 0) return "";

  const queryWords = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);

  // Score each entry by relevance
  const scored = knowledge.map((entry) => {
    let score = 0;
    const entryText = `${entry.question} ${entry.answer} ${(entry.keywords || []).join(" ")}`.toLowerCase();

    for (const word of queryWords) {
      if (entryText.includes(word)) score += 1;
    }

    return { entry, score };
  });

  // Take top 5 most relevant entries
  const relevant = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (relevant.length === 0) return "";

  return relevant
    .map((r) => `Q: ${r.entry.question}\nA: ${r.entry.answer}`)
    .join("\n\n---\n\n");
}
