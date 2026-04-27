"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

  // widget/file-engine.ts
  var FileEngine = class {
    constructor() {
      this.entries = [];
      this.loaded = false;
    }
    async load(url) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load knowledge base: ${res.status}`);
        const data = await res.json();
        this.entries = Array.isArray(data) ? data : data.entries || [];
        this.loaded = true;
      } catch (err) {
        console.error("[EasyChat] Failed to load knowledge base:", err);
        this.entries = [];
        this.loaded = true;
      }
    }
    isLoaded() {
      return this.loaded;
    }
    /**
     * Find the best matching answer for a user question.
     * Uses a scoring algorithm based on:
     * 1. Exact keyword matches
     * 2. Word overlap between question and knowledge entries
     * 3. Fuzzy partial word matching
     */
    getAnswer(userQuestion) {
      if (this.entries.length === 0) {
        return "I don't have any information loaded yet. Please check back later!";
      }
      const query = userQuestion.toLowerCase().trim();
      const queryWords = this.tokenize(query);
      let bestScore = 0;
      let bestAnswer = "";
      for (const entry of this.entries) {
        let score = 0;
        const entryQuestion = entry.question.toLowerCase();
        const entryWords = this.tokenize(entryQuestion);
        if (query === entryQuestion) {
          score += 100;
        }
        for (const qWord of queryWords) {
          for (const eWord of entryWords) {
            if (qWord === eWord) {
              score += 10;
            } else if (eWord.includes(qWord) || qWord.includes(eWord)) {
              score += 5;
            } else if (this.levenshtein(qWord, eWord) <= 2) {
              score += 3;
            }
          }
        }
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
      if (bestScore < 5) {
        return "I'm not sure I understand your question. Could you try rephrasing it?";
      }
      return bestAnswer;
    }
    tokenize(text) {
      return text.replace(/[^\w\s]/g, " ").split(/\s+/).filter((w) => w.length > 1);
    }
    levenshtein(a, b) {
      if (a.length === 0) return b.length;
      if (b.length === 0) return a.length;
      const matrix = [];
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
  };

  // widget/ai-engine.ts
  var AIEngine = class {
    constructor(serverUrl) {
      this.serverUrl = serverUrl.replace(/\/$/, "");
    }
    async getAnswer(userMessage, history) {
      try {
        const res = await fetch(`${this.serverUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            history: history.slice(-10).map((m) => ({
              role: m.role === "user" ? "user" : "assistant",
              content: m.content
            }))
          })
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
  };

  // widget/styles.ts
  function getStyles(primaryColor, darkMode, borderRadius, width, height) {
    const bg = darkMode ? "#1e1e2e" : "#ffffff";
    const bgSecondary = darkMode ? "#2a2a3e" : "#f3f4f6";
    const text = darkMode ? "#e2e8f0" : "#1f2937";
    const textMuted = darkMode ? "#94a3b8" : "#6b7280";
    const border = darkMode ? "#374151" : "#e5e7eb";
    const userBubble = primaryColor;
    const botBubble = darkMode ? "#2a2a3e" : "#f3f4f6";
    return `
    .ec-widget {
      --ec-primary: ${primaryColor};
      --ec-bg: ${bg};
      --ec-bg-secondary: ${bgSecondary};
      --ec-text: ${text};
      --ec-text-muted: ${textMuted};
      --ec-border: ${border};
      --ec-radius: ${borderRadius}px;
      --ec-width: ${width}px;
      --ec-height: ${height}px;
      --ec-user-bubble: ${userBubble};
      --ec-bot-bubble: ${botBubble};

      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: var(--ec-text);
      box-sizing: border-box;
      z-index: 99999;
    }

    .ec-widget *, .ec-widget *::before, .ec-widget *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* Toggle button */
    .ec-toggle {
      position: fixed;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--ec-primary);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: transform 0.2s, box-shadow 0.2s;
      z-index: 99999;
    }
    .ec-toggle:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    }
    .ec-toggle svg { width: 24px; height: 24px; fill: #fff; }
    .ec-toggle.ec-pos-br { bottom: 20px; right: 20px; }
    .ec-toggle.ec-pos-bl { bottom: 20px; left: 20px; }

    /* Chat window */
    .ec-window {
      position: fixed;
      width: var(--ec-width);
      height: var(--ec-height);
      max-height: calc(100vh - 100px);
      max-width: calc(100vw - 32px);
      background: var(--ec-bg);
      border-radius: var(--ec-radius);
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      border: 1px solid var(--ec-border);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 99999;
      opacity: 0;
      transform: translateY(16px) scale(0.95);
      transition: opacity 0.25s ease, transform 0.25s ease;
      pointer-events: none;
    }
    .ec-window.ec-open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }
    .ec-window.ec-pos-br { bottom: 88px; right: 20px; }
    .ec-window.ec-pos-bl { bottom: 88px; left: 20px; }

    /* Header */
    .ec-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      background: var(--ec-primary);
      color: #fff;
      flex-shrink: 0;
    }
    .ec-header-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }
    .ec-header-info { flex: 1; }
    .ec-header-name { font-weight: 600; font-size: 14px; }
    .ec-header-status { font-size: 11px; opacity: 0.8; }
    .ec-header-close {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
      transition: opacity 0.15s;
    }
    .ec-header-close:hover { opacity: 1; }
    .ec-header-close svg { width: 18px; height: 18px; }

    /* Messages area */
    .ec-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .ec-messages::-webkit-scrollbar { width: 4px; }
    .ec-messages::-webkit-scrollbar-thumb { background: var(--ec-border); border-radius: 4px; }

    /* Message bubbles */
    .ec-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 13px;
      line-height: 1.5;
      word-wrap: break-word;
      animation: ec-fade-in 0.2s ease;
    }
    .ec-msg-user {
      background: var(--ec-user-bubble);
      color: #fff;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .ec-msg-bot {
      background: var(--ec-bot-bubble);
      color: var(--ec-text);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }

    /* Typing indicator */
    .ec-typing {
      display: flex;
      gap: 4px;
      padding: 10px 14px;
      background: var(--ec-bot-bubble);
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      width: fit-content;
    }
    .ec-typing-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--ec-text-muted);
      animation: ec-bounce 1.2s infinite;
    }
    .ec-typing-dot:nth-child(2) { animation-delay: 0.15s; }
    .ec-typing-dot:nth-child(3) { animation-delay: 0.3s; }

    /* Suggestions */
    .ec-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 0 16px 12px;
      flex-shrink: 0;
    }
    .ec-suggestion {
      padding: 6px 12px;
      border-radius: 16px;
      border: 1px solid var(--ec-border);
      background: var(--ec-bg);
      color: var(--ec-text);
      font-size: 12px;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }
    .ec-suggestion:hover {
      background: var(--ec-bg-secondary);
      border-color: var(--ec-primary);
      color: var(--ec-primary);
    }

    /* Input area */
    .ec-input-area {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-top: 1px solid var(--ec-border);
      flex-shrink: 0;
    }
    .ec-input {
      flex: 1;
      border: 1px solid var(--ec-border);
      border-radius: 20px;
      padding: 8px 14px;
      font-size: 13px;
      background: var(--ec-bg);
      color: var(--ec-text);
      outline: none;
      transition: border-color 0.15s;
      font-family: inherit;
    }
    .ec-input::placeholder { color: var(--ec-text-muted); }
    .ec-input:focus { border-color: var(--ec-primary); }

    .ec-send {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--ec-primary);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.15s;
    }
    .ec-send:disabled { opacity: 0.5; cursor: not-allowed; }
    .ec-send svg { width: 16px; height: 16px; fill: #fff; }

    /* Powered by */
    .ec-powered {
      text-align: center;
      padding: 6px;
      font-size: 10px;
      color: var(--ec-text-muted);
      flex-shrink: 0;
    }
    .ec-powered a {
      color: var(--ec-primary);
      text-decoration: none;
    }

    @keyframes ec-fade-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes ec-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
    }

    /* Mobile responsive */
    @media (max-width: 480px) {
      .ec-window {
        width: 100vw !important;
        height: calc(100vh - 80px) !important;
        max-width: 100vw;
        max-height: calc(100vh - 80px);
        bottom: 72px !important;
        right: 0 !important;
        left: 0 !important;
        border-radius: 16px 16px 0 0;
      }
    }
  `;
  }

  // widget/easychat.ts
  var ICONS = {
    chat: '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>',
    bot: "\u{1F916}"
  };
  var DEFAULTS = {
    botName: "EasyChat",
    welcomeMessage: "Hi there! \u{1F44B} How can I help you today?",
    placeholder: "Type your message...",
    theme: {
      primaryColor: "#6366f1",
      position: "bottom-right",
      darkMode: false,
      borderRadius: 16,
      width: 380,
      height: 520
    },
    mode: "file",
    knowledgeUrl: "/knowledge.json",
    serverUrl: "http://localhost:3001",
    suggestions: [],
    autoOpenDelay: 0
  };
  var EasyChat = class {
    constructor(userConfig) {
      this.messages = [];
      this.isOpen = false;
      this.isTyping = false;
      this.fileEngine = null;
      this.aiEngine = null;
      this.suggestionsShown = true;
      this.config = this.mergeConfig(userConfig);
      this.init();
    }
    mergeConfig(userConfig) {
      return __spreadProps(__spreadValues(__spreadValues({}, DEFAULTS), userConfig), {
        theme: __spreadValues(__spreadValues({}, DEFAULTS.theme), userConfig.theme || {}),
        suggestions: userConfig.suggestions || DEFAULTS.suggestions
      });
    }
    async init() {
      this.styleEl = document.createElement("style");
      const { primaryColor, darkMode, borderRadius, width, height } = this.config.theme;
      this.styleEl.textContent = getStyles(primaryColor, darkMode, borderRadius, width, height);
      document.head.appendChild(this.styleEl);
      this.container = document.createElement("div");
      this.container.className = "ec-widget";
      this.container.innerHTML = this.buildHTML();
      document.body.appendChild(this.container);
      this.toggleEl = this.container.querySelector(".ec-toggle");
      this.windowEl = this.container.querySelector(".ec-window");
      this.messagesEl = this.container.querySelector(".ec-messages");
      this.inputEl = this.container.querySelector(".ec-input");
      this.suggestionsEl = this.container.querySelector(".ec-suggestions");
      this.toggleEl.addEventListener("click", () => this.toggle());
      this.container.querySelector(".ec-header-close").addEventListener("click", () => this.toggle());
      this.container.querySelector(".ec-send").addEventListener("click", () => this.sendMessage());
      this.inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
      this.container.querySelectorAll(".ec-suggestion").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.inputEl.value = btn.textContent || "";
          this.sendMessage();
        });
      });
      if (this.config.mode === "file") {
        this.fileEngine = new FileEngine();
        await this.fileEngine.load(this.config.knowledgeUrl);
      } else {
        this.aiEngine = new AIEngine(this.config.serverUrl);
      }
      this.addMessage("bot", this.config.welcomeMessage);
      if (this.config.autoOpenDelay > 0) {
        setTimeout(() => this.open(), this.config.autoOpenDelay);
      }
    }
    buildHTML() {
      const pos = this.config.theme.position === "bottom-left" ? "ec-pos-bl" : "ec-pos-br";
      const suggestionsHTML = this.config.suggestions.length > 0 ? `<div class="ec-suggestions">${this.config.suggestions.map(
        (s) => `<button class="ec-suggestion">${this.escapeHTML(s)}</button>`
      ).join("")}</div>` : '<div class="ec-suggestions"></div>';
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
    toggle() {
      this.isOpen ? this.close() : this.open();
    }
    open() {
      this.isOpen = true;
      this.windowEl.classList.add("ec-open");
      this.toggleEl.innerHTML = ICONS.close;
      this.inputEl.focus();
    }
    close() {
      this.isOpen = false;
      this.windowEl.classList.remove("ec-open");
      this.toggleEl.innerHTML = ICONS.chat;
    }
    addMessage(role, content) {
      const msg = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        role,
        content,
        timestamp: Date.now()
      };
      this.messages.push(msg);
      this.renderMessage(msg);
      this.scrollToBottom();
    }
    renderMessage(msg) {
      const div = document.createElement("div");
      div.className = `ec-msg ec-msg-${msg.role === "user" ? "user" : "bot"}`;
      div.textContent = msg.content;
      this.messagesEl.appendChild(div);
    }
    async sendMessage() {
      const text = this.inputEl.value.trim();
      if (!text || this.isTyping) return;
      this.inputEl.value = "";
      if (this.suggestionsShown) {
        this.suggestionsShown = false;
        this.suggestionsEl.style.display = "none";
      }
      this.addMessage("user", text);
      this.showTyping();
      let reply;
      if (this.config.mode === "file" && this.fileEngine) {
        await this.delay(300 + Math.random() * 500);
        reply = this.fileEngine.getAnswer(text);
      } else if (this.config.mode === "ai" && this.aiEngine) {
        reply = await this.aiEngine.getAnswer(text, this.messages.slice(0, -1));
      } else {
        reply = "Chat is not configured correctly. Please check the setup.";
      }
      this.hideTyping();
      this.addMessage("bot", reply);
    }
    showTyping() {
      this.isTyping = true;
      const typing = document.createElement("div");
      typing.className = "ec-typing";
      typing.innerHTML = '<div class="ec-typing-dot"></div><div class="ec-typing-dot"></div><div class="ec-typing-dot"></div>';
      this.messagesEl.appendChild(typing);
      this.scrollToBottom();
    }
    hideTyping() {
      this.isTyping = false;
      const typing = this.messagesEl.querySelector(".ec-typing");
      if (typing) typing.remove();
    }
    scrollToBottom() {
      requestAnimationFrame(() => {
        this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
      });
    }
    escapeHTML(str) {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    /** Destroy the widget and clean up */
    destroy() {
      this.container.remove();
      this.styleEl.remove();
    }
  };
  (function autoInit() {
    if (typeof document === "undefined") return;
    const script = document.currentScript;
    if (!script) return;
    const configUrl = script.getAttribute("data-config");
    const mode = script.getAttribute("data-mode");
    if (configUrl) {
      fetch(configUrl).then((res) => {
        if (!res.ok) throw new Error(`Failed to load config: ${res.status}`);
        return res.json();
      }).then((config) => {
        window.EasyChatInstance = new EasyChat(config);
      }).catch((err) => console.error("[EasyChat] Failed to load config:", err));
    } else if (mode) {
      const config = {
        mode,
        botName: script.getAttribute("data-bot-name") || void 0,
        welcomeMessage: script.getAttribute("data-welcome") || void 0,
        knowledgeUrl: script.getAttribute("data-knowledge-url") || void 0,
        serverUrl: script.getAttribute("data-server-url") || void 0,
        theme: {
          primaryColor: script.getAttribute("data-color") || void 0,
          position: script.getAttribute("data-position") || void 0,
          darkMode: script.getAttribute("data-dark") === "true"
        }
      };
      window.EasyChatInstance = new EasyChat(config);
    }
  })();
  if (typeof window !== "undefined") {
    window.EasyChat = EasyChat;
  }
})();
