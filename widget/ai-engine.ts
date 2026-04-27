import type { ChatMessage } from "./types";

/**
 * AI-powered chatbot engine.
 * Sends messages to a backend server that handles OpenAI calls securely.
 */
export class AIEngine {
  private serverUrl: string;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl.replace(/\/$/, "");
  }

  async getAnswer(
    userMessage: string,
    history: ChatMessage[]
  ): Promise<string> {
    try {
      const res = await fetch(`${this.serverUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: history.slice(-10).map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Server error" }));
        throw new Error(err.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      return data.message || data.reply || data.response || "Sorry, I couldn't generate a response.";
    } catch (err) {
      console.error("[EasyChat] AI request failed:", err);
      return "Sorry, I'm having trouble connecting. Please try again.";
    }
  }
}
