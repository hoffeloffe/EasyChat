import type { EasyChatConfig, ChatMessage } from "./types";
import { FileEngine } from "./file-engine";
import { AIEngine } from "./ai-engine";
import { getStyles } from "./styles";

const ICONS = {
  chat: '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/></svg>',
  send: '<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>',
  bot: '🤖',
};

const DEFAULTS: Required<EasyChatConfig> = {
  botName: "EasyChat",
  welcomeMessage: "Hi there! 👋 How can I help you today?",
  placeholder: "Type your message...",
  theme: {
    primaryColor: "#6366f1",
    position: "bottom-right",
    darkMode: false,
    borderRadius: 16,
    width: 380,
    height: 520,
  },
  mode: "file",
  knowledgeUrl: "/knowledge.json",
  serverUrl: "http://localhost:3001",
  suggestions: [],
  autoOpenDelay: 0,
};

export class EasyChat {
  private config: Required<EasyChatConfig>;
  private messages: ChatMessage[] = [];
  private isOpen = false;
  private isTyping = false;
  private fileEngine: FileEngine | null = null;
  private aiEngine: AIEngine | null = null;
  private container!: HTMLDivElement;
  private messagesEl!: HTMLDivElement;
  private inputEl!: HTMLInputElement;
  private windowEl!: HTMLDivElement;
  private toggleEl!: HTMLButtonElement;
  private suggestionsEl!: HTMLDivElement;
  private suggestionsShown = true;
  private styleEl!: HTMLStyleElement;

  constructor(userConfig: Partial<EasyChatConfig>) {
    this.config = this.mergeConfig(userConfig);
    this.init();
  }

  private mergeConfig(userConfig: Partial<EasyChatConfig>): Required<EasyChatConfig> {
    return {
      ...DEFAULTS,
      ...userConfig,
      theme: { ...DEFAULTS.theme, ...(userConfig.theme || {}) },
      suggestions: userConfig.suggestions || DEFAULTS.suggestions,
    };
  }

  private async init(): Promise<void> {
    // Inject styles
    this.styleEl = document.createElement("style");
    const { primaryColor, darkMode, borderRadius, width, height } = this.config.theme;
    this.styleEl.textContent = getStyles(primaryColor!, darkMode!, borderRadius!, width!, height!);
    document.head.appendChild(this.styleEl);

    // Create DOM
    this.container = document.createElement("div");
    this.container.className = "ec-widget";
    this.container.innerHTML = this.buildHTML();
    document.body.appendChild(this.container);

    // Cache elements
    this.toggleEl = this.container.querySelector(".ec-toggle")!;
    this.windowEl = this.container.querySelector(".ec-window")!;
    this.messagesEl = this.container.querySelector(".ec-messages")!;
    this.inputEl = this.container.querySelector(".ec-input")!;
    this.suggestionsEl = this.container.querySelector(".ec-suggestions")!;

    // Bind events
    this.toggleEl.addEventListener("click", () => this.toggle());
    this.container.querySelector(".ec-header-close")!.addEventListener("click", () => this.toggle());
    this.container.querySelector(".ec-send")!.addEventListener("click", () => this.sendMessage());
    this.inputEl.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Bind suggestion clicks
    this.container.querySelectorAll(".ec-suggestion").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.inputEl.value = btn.textContent || "";
        this.sendMessage();
      });
    });

    // Initialize engine
    if (this.config.mode === "file") {
      this.fileEngine = new FileEngine();
      await this.fileEngine.load(this.config.knowledgeUrl);
    } else {
      this.aiEngine = new AIEngine(this.config.serverUrl);
    }

    // Add welcome message
    this.addMessage("bot", this.config.welcomeMessage);

    // Auto-open
    if (this.config.autoOpenDelay > 0) {
      setTimeout(() => this.open(), this.config.autoOpenDelay);
    }
  }

  private buildHTML(): string {
    const pos = this.config.theme.position === "bottom-left" ? "ec-pos-bl" : "ec-pos-br";

    const suggestionsHTML = this.config.suggestions.length > 0
      ? `<div class="ec-suggestions">${this.config.suggestions.map(
          (s) => `<button class="ec-suggestion">${this.escapeHTML(s)}</button>`
        ).join("")}</div>`
      : '<div class="ec-suggestions"></div>';

    return `
      <button class="ec-toggle ${pos}" aria-label="Open chat">${ICONS.chat}</button>
      <div class="ec-window ${pos}">
        <div class="ec-header">
          <div class="ec-header-avatar">${ICONS.bot}</div>
          <div class="ec-header-info">
            <div class="ec-header-name">${this.escapeHTML(this.config.botName)}</div>
            <div class="ec-header-status">Online</div>
          </div>
          <button class="ec-header-close" aria-label="Close chat">${ICONS.close}</button>
        </div>
        <div class="ec-messages"></div>
        ${suggestionsHTML}
        <div class="ec-input-area">
          <input
            type="text"
            class="ec-input"
            placeholder="${this.escapeHTML(this.config.placeholder)}"
            autocomplete="off"
          />
          <button class="ec-send" aria-label="Send message">${ICONS.send}</button>
        </div>
        <div class="ec-powered">
          Powered by <a href="https://github.com/hoffeloffe/EasyChat" target="_blank">EasyChat</a>
        </div>
      </div>
    `;
  }

  private toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  open(): void {
    this.isOpen = true;
    this.windowEl.classList.add("ec-open");
    this.toggleEl.innerHTML = ICONS.close;
    this.inputEl.focus();
  }

  close(): void {
    this.isOpen = false;
    this.windowEl.classList.remove("ec-open");
    this.toggleEl.innerHTML = ICONS.chat;
  }

  private addMessage(role: "user" | "bot", content: string): void {
    const msg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      role,
      content,
      timestamp: Date.now(),
    };
    this.messages.push(msg);
    this.renderMessage(msg);
    this.scrollToBottom();
  }

  private renderMessage(msg: ChatMessage): void {
    const div = document.createElement("div");
    div.className = `ec-msg ec-msg-${msg.role === "user" ? "user" : "bot"}`;
    div.textContent = msg.content;
    this.messagesEl.appendChild(div);
  }

  private async sendMessage(): Promise<void> {
    const text = this.inputEl.value.trim();
    if (!text || this.isTyping) return;

    this.inputEl.value = "";

    // Hide suggestions after first message
    if (this.suggestionsShown) {
      this.suggestionsShown = false;
      this.suggestionsEl.style.display = "none";
    }

    this.addMessage("user", text);
    this.showTyping();

    let reply: string;

    if (this.config.mode === "file" && this.fileEngine) {
      // Small delay to feel more natural
      await this.delay(300 + Math.random() * 500);
      reply = this.fileEngine.getAnswer(text);
    } else if (this.config.mode === "ai" && this.aiEngine) {
      // Pass history excluding the message we just added — the server appends it separately
      reply = await this.aiEngine.getAnswer(text, this.messages.slice(0, -1));
    } else {
      reply = "Chat is not configured correctly. Please check the setup.";
    }

    this.hideTyping();
    this.addMessage("bot", reply);
  }

  private showTyping(): void {
    this.isTyping = true;
    const typing = document.createElement("div");
    typing.className = "ec-typing";
    typing.innerHTML = '<div class="ec-typing-dot"></div><div class="ec-typing-dot"></div><div class="ec-typing-dot"></div>';
    this.messagesEl.appendChild(typing);
    this.scrollToBottom();
  }

  private hideTyping(): void {
    this.isTyping = false;
    const typing = this.messagesEl.querySelector(".ec-typing");
    if (typing) typing.remove();
  }

  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    });
  }

  private escapeHTML(str: string): string {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** Destroy the widget and clean up */
  destroy(): void {
    this.container.remove();
    this.styleEl.remove();
  }
}

// Auto-initialize from script tag data attributes
(function autoInit() {
  if (typeof document === "undefined") return;

  const script = document.currentScript as HTMLScriptElement | null;
  if (!script) return;

  const configUrl = script.getAttribute("data-config");
  const mode = script.getAttribute("data-mode") as "file" | "ai" | null;

  if (configUrl) {
    // Load config from URL
    fetch(configUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load config: ${res.status}`);
        return res.json();
      })
      .then((config) => {
        (window as unknown as Record<string, unknown>).EasyChatInstance = new EasyChat(config);
      })
      .catch((err) => console.error("[EasyChat] Failed to load config:", err));
  } else if (mode) {
    // Inline config from data attributes
    const config: Partial<EasyChatConfig> = {
      mode,
      botName: script.getAttribute("data-bot-name") || undefined,
      welcomeMessage: script.getAttribute("data-welcome") || undefined,
      knowledgeUrl: script.getAttribute("data-knowledge-url") || undefined,
      serverUrl: script.getAttribute("data-server-url") || undefined,
      theme: {
        primaryColor: script.getAttribute("data-color") || undefined,
        position: (script.getAttribute("data-position") as "bottom-right" | "bottom-left") || undefined,
        darkMode: script.getAttribute("data-dark") === "true",
      },
    };
    (window as unknown as Record<string, unknown>).EasyChatInstance = new EasyChat(config);
  }
})();

// Expose globally
if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).EasyChat = EasyChat;
}
