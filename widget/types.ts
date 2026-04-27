export interface EasyChatConfig {
  botName?: string;
  welcomeMessage?: string;
  placeholder?: string;
  theme?: {
    primaryColor?: string;
    position?: "bottom-right" | "bottom-left";
    darkMode?: boolean;
    borderRadius?: number;
    width?: number;
    height?: number;
  };
  mode: "file" | "ai";
  // File mode: URL to knowledge base JSON
  knowledgeUrl?: string;
  // AI mode: endpoint that handles chat
  serverUrl?: string;
  // Suggested quick-reply questions
  suggestions?: string[];
  // Auto-open after N ms (0 = don't auto-open)
  autoOpenDelay?: number;
}

export interface KnowledgeEntry {
  question: string;
  answer: string;
  keywords?: string[];
  category?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: number;
}
