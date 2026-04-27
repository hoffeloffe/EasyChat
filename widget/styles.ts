/**
 * Returns all CSS for the widget as a string.
 * Uses CSS custom properties so users can override colors easily.
 */
export function getStyles(primaryColor: string, darkMode: boolean, borderRadius: number, width: number, height: number): string {
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
