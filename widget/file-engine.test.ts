import { describe, it, expect, beforeEach } from "vitest";
import { FileEngine } from "./file-engine";

// Mock fetch for testing
const mockKnowledge = [
  {
    question: "What are your business hours?",
    answer: "We are open Monday to Friday, 9am to 5pm EST.",
    keywords: ["hours", "open", "schedule", "time"],
  },
  {
    question: "How do I reset my password?",
    answer: "Go to Settings > Account > Reset Password.",
    keywords: ["password", "reset", "forgot", "login"],
  },
  {
    question: "What is your return policy?",
    answer: "You can return items within 30 days of purchase for a full refund.",
    keywords: ["return", "refund", "policy", "money"],
  },
  {
    question: "Do you offer free shipping?",
    answer: "Yes! Free shipping on all orders over $50.",
    keywords: ["shipping", "free", "delivery", "cost"],
  },
];

describe("FileEngine", () => {
  let engine: FileEngine;

  beforeEach(() => {
    engine = new FileEngine();
    // Manually set entries since we can't mock fetch in unit tests
    (engine as unknown as { entries: typeof mockKnowledge; loaded: boolean }).entries = mockKnowledge;
    (engine as unknown as { entries: typeof mockKnowledge; loaded: boolean }).loaded = true;
  });

  it("returns correct answer for exact question match", () => {
    const answer = engine.getAnswer("What are your business hours?");
    expect(answer).toContain("Monday to Friday");
  });

  it("matches by keywords", () => {
    const answer = engine.getAnswer("password reset");
    expect(answer).toContain("Settings");
  });

  it("handles partial word matches", () => {
    const answer = engine.getAnswer("return policy");
    expect(answer).toContain("30 days");
  });

  it("handles typos with fuzzy matching", () => {
    const answer = engine.getAnswer("free shiping on orders");
    expect(answer).toContain("shipping");
  });

  it("returns fallback for completely unrelated questions", () => {
    const answer = engine.getAnswer("xyz abc 123");
    expect(answer).toContain("not sure");
  });

  it("returns fallback when no entries are loaded", () => {
    const emptyEngine = new FileEngine();
    (emptyEngine as unknown as { entries: unknown[]; loaded: boolean }).entries = [];
    (emptyEngine as unknown as { entries: unknown[]; loaded: boolean }).loaded = true;
    const answer = emptyEngine.getAnswer("Hello");
    expect(answer).toContain("don't have any information");
  });

  it("matches questions about hours", () => {
    const answer = engine.getAnswer("when are you open?");
    expect(answer).toContain("Monday to Friday");
  });

  it("matches questions about shipping", () => {
    const answer = engine.getAnswer("is shipping free?");
    expect(answer).toContain("Free shipping");
  });
});
