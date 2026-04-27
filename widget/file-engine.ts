import type { KnowledgeEntry } from "./types";

/**
 * File-based chatbot engine.
 * Performs fuzzy keyword matching against a knowledge base loaded from JSON.
 * Runs 100% in the browser — no AI, no server, no API keys.
 */
export class FileEngine {
  private entries: KnowledgeEntry[] = [];
  private loaded = false;

  async load(url: string): Promise<void> {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load knowledge base: ${res.status}`);
      const data = await res.json();

      // Support both array and { entries: [...] } format
      this.entries = Array.isArray(data) ? data : data.entries || [];
      this.loaded = true;
    } catch (err) {
      console.error("[EasyChat] Failed to load knowledge base:", err);
      this.entries = [];
      this.loaded = true;
    }
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  /**
   * Find the best matching answer for a user question.
   * Uses a scoring algorithm based on:
   * 1. Exact keyword matches
   * 2. Word overlap between question and knowledge entries
   * 3. Fuzzy partial word matching
   */
  getAnswer(userQuestion: string): string {
    if (this.entries.length === 0) {
      return "I don't have any information loaded yet. Please check back later!";
    }

    const query = userQuestion.toLowerCase().trim();
    const queryWords = this.tokenize(query);

    let bestScore = 0;
    let bestAnswer = "";

    for (const entry of this.entries) {
      let score = 0;

      // Score against question field
      const entryQuestion = entry.question.toLowerCase();
      const entryWords = this.tokenize(entryQuestion);

      // Exact match bonus
      if (query === entryQuestion) {
        score += 100;
      }

      // Word overlap scoring
      for (const qWord of queryWords) {
        for (const eWord of entryWords) {
          if (qWord === eWord) {
            score += 10; // exact word match
          } else if (eWord.includes(qWord) || qWord.includes(eWord)) {
            score += 5; // partial word match
          } else if (this.levenshtein(qWord, eWord) <= 2) {
            score += 3; // fuzzy match (typo tolerance)
          }
        }
      }

      // Keyword bonus scoring
      if (entry.keywords) {
        for (const keyword of entry.keywords) {
          const kw = keyword.toLowerCase();
          if (query.includes(kw)) {
            score += 15;
          }
          for (const qWord of queryWords) {
            if (qWord === kw) score += 12;
            else if (kw.includes(qWord) || qWord.includes(kw)) score += 6;
          }
        }
      }

      // Answer text matching (lower weight)
      const answerWords = this.tokenize(entry.answer.toLowerCase());
      for (const qWord of queryWords) {
        if (answerWords.includes(qWord)) {
          score += 2;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestAnswer = entry.answer;
      }
    }

    // Minimum confidence threshold
    if (bestScore < 5) {
      return "I'm not sure I understand your question. Could you try rephrasing it?";
    }

    return bestAnswer;
  }

  private tokenize(text: string): string[] {
    return text
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 1);
  }

  private levenshtein(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    return matrix[b.length][a.length];
  }
}
