"use client";

import { useState } from "react";
import {
  MessageSquare,
  Settings,
  BookOpen,
  Code,
  Copy,
  Check,
  Zap,
  Shield,
  Palette,
} from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
import { toast } from "sonner";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <ConfigGenerator />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-indigo-600" />
          <span className="font-bold text-lg">EasyChat</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
          <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900">How it Works</a>
          <a href="#generator" className="text-sm text-gray-600 hover:text-gray-900">Generator</a>
          <a
            href="https://github.com/hoffeloffe/EasyChat"
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            <GithubIcon className="h-4 w-4" /> GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6">
          <Zap className="h-3.5 w-3.5" /> 100% Free & Open Source
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
          Add a chatbot to any website
          <br />
          <span className="text-indigo-600">in one line of code</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Two modes: file-based (no AI needed) and AI-powered. 
          Drop in a script tag, point it at your knowledge base, done.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="#generator"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Generate Your Widget
          </a>
          <a
            href="https://github.com/hoffeloffe/EasyChat"
            target="_blank"
            className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <GithubIcon className="h-4 w-4" /> View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: BookOpen,
      title: "File Mode - No AI Required",
      desc: "Add a JSON file with questions & answers. The chatbot matches user queries using smart keyword matching. Runs 100% in the browser.",
    },
    {
      icon: Zap,
      title: "AI Mode - GPT Powered",
      desc: "Connect to OpenAI for intelligent responses. Your knowledge base is used as context so the AI stays accurate and on-topic.",
    },
    {
      icon: Code,
      title: "One Line Integration",
      desc: "Add a single script tag to your HTML. Works with any website - React, Vue, WordPress, plain HTML, anything.",
    },
    {
      icon: Palette,
      title: "Fully Customizable",
      desc: "Change colors, position, bot name, welcome message, and suggested questions. Override styles with CSS variables.",
    },
    {
      icon: Shield,
      title: "Secure by Default",
      desc: "AI mode uses a backend server to keep your API key safe. File mode has zero external dependencies.",
    },
    {
      icon: Settings,
      title: "Easy Configuration",
      desc: "Use data attributes for quick setup, or a JSON config file for advanced control. No build step required.",
    },
  ];

  return (
    <section id="features" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Why EasyChat?</h2>
        <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
          Built for developers who want a chatbot that just works, with zero complexity.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-sm transition-all">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Choose Your Mode",
      desc: "File mode for simple Q&A from a JSON file, or AI mode for intelligent GPT-powered responses.",
    },
    {
      step: "2",
      title: "Create Your Knowledge Base",
      desc: "Add a knowledge.json file with questions, answers, and keywords. Or use .md and .txt files.",
    },
    {
      step: "3",
      title: "Add the Script Tag",
      desc: "Paste one line of HTML into your page. Configure with data attributes or a config file.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="space-y-8">
          {steps.map((s) => (
            <div key={s.step} className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                {s.step}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{s.title}</h3>
                <p className="text-gray-500 mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConfigGenerator() {
  const [mode, setMode] = useState<"file" | "ai">("file");
  const [botName, setBotName] = useState("Support Bot");
  const [welcome, setWelcome] = useState("Hi there! 👋 How can I help?");
  const [color, setColor] = useState("#6366f1");
  const [position, setPosition] = useState<"bottom-right" | "bottom-left">("bottom-right");
  const [knowledgeUrl, setKnowledgeUrl] = useState("/knowledge.json");
  const [serverUrl, setServerUrl] = useState("http://localhost:3001");
  const [copied, setCopied] = useState(false);

  const escAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const scriptTag = mode === "file"
    ? `<script src="https://cdn.jsdelivr.net/gh/hoffeloffe/EasyChat@main/dist/easychat.min.js"
  data-mode="file"
  data-bot-name="${escAttr(botName)}"
  data-welcome="${escAttr(welcome)}"
  data-knowledge-url="${escAttr(knowledgeUrl)}"
  data-color="${escAttr(color)}"
  data-position="${escAttr(position)}">
</script>`
    : `<script src="https://cdn.jsdelivr.net/gh/hoffeloffe/EasyChat@main/dist/easychat.min.js"
  data-mode="ai"
  data-bot-name="${escAttr(botName)}"
  data-welcome="${escAttr(welcome)}"
  data-server-url="${escAttr(serverUrl)}"
  data-color="${escAttr(color)}"
  data-position="${escAttr(position)}">
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptTag);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="generator" className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Generate Your Widget</h2>
        <p className="text-gray-500 text-center mb-12">
          Configure your chatbot and get the embed code.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Config form */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode("file")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                    mode === "file"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  📁 File Mode
                </button>
                <button
                  onClick={() => setMode("ai")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                    mode === "ai"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  🤖 AI Mode
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bot Name</label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Welcome Message</label>
              <input
                type="text"
                value={welcome}
                onChange={(e) => setWelcome(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Primary Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as "bottom-right" | "bottom-left")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                </select>
              </div>
            </div>

            {mode === "file" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Knowledge Base URL</label>
                <input
                  type="text"
                  value={knowledgeUrl}
                  onChange={(e) => setKnowledgeUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="/knowledge.json"
                />
                <p className="text-xs text-gray-400 mt-1">Path to your knowledge base JSON file</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Server URL</label>
                <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="http://localhost:3001"
                />
                <p className="text-xs text-gray-400 mt-1">URL where the EasyChat server is running</p>
              </div>
            )}
          </div>

          {/* Generated code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Embed Code</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-sm overflow-x-auto leading-relaxed">
              <code>{scriptTag}</code>
            </pre>

            <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
              <h4 className="font-medium text-indigo-900 mb-2 text-sm">
                {mode === "file" ? "📁 File Mode Setup" : "🤖 AI Mode Setup"}
              </h4>
              {mode === "file" ? (
                <ol className="text-sm text-indigo-800 space-y-1.5 list-decimal list-inside">
                  <li>Create a <code className="bg-indigo-100 px-1 rounded">knowledge.json</code> file</li>
                  <li>Add questions, answers, and keywords</li>
                  <li>Host it on your website</li>
                  <li>Paste the embed code into your HTML</li>
                </ol>
              ) : (
                <ol className="text-sm text-indigo-800 space-y-1.5 list-decimal list-inside">
                  <li>Clone the repo and run <code className="bg-indigo-100 px-1 rounded">npm install</code></li>
                  <li>Set <code className="bg-indigo-100 px-1 rounded">OPENAI_API_KEY</code> in your .env</li>
                  <li>Add knowledge files to the <code className="bg-indigo-100 px-1 rounded">/knowledge</code> folder</li>
                  <li>Run <code className="bg-indigo-100 px-1 rounded">npm run server</code></li>
                  <li>Paste the embed code into your HTML</li>
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-indigo-600" />
          <span>EasyChat - Free & Open Source</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/hoffeloffe/EasyChat" target="_blank" className="hover:text-gray-900">GitHub</a>
          <span>MIT License</span>
        </div>
      </div>
    </footer>
  );
}
