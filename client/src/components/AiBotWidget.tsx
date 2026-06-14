import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const API = "/api";

type Step = "welcome" | "interest" | "form" | "done";

interface Message {
  text: string;
  sender: "bot" | "user";
}

const INTERESTS = [
  { key: "content", label: "Content Creation", emoji: "🎨", desc: "Digital branding, visual effects, content strategy" },
  { key: "trading", label: "Algorithmic Trading", emoji: "📊", desc: "Forex & Gold automated trading, MT5 EAs" },
  { key: "realestate", label: "Real Estate", emoji: "🏠", desc: "Phnom Penh shop houses, premium properties" },
];

export default function AiBotWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [step, setStep] = useState<Step>("welcome");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "👋 Hello! I'm Saruon's AI assistant. Ready to explore what I can do for you?",
    },
  ]);
  const [interest, setInterest] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, step]);

  const addBotMsg = (text: string) => {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
  };

  const addUserMsg = (text: string) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
  };

  const handleStart = () => {
    addUserMsg("Let's explore!");
    setStep("interest");
    setTimeout(() => {
      addBotMsg("Awesome! Which area are you most interested in? 👇");
    }, 400);
  };

  const handleInterest = (key: string, label: string) => {
    setInterest(key);
    addUserMsg(label);
    setStep("form");
    setTimeout(() => {
      addBotMsg("Great choice! Drop your details and I'll make sure Saruon gets back to you ASAP. 🚀");
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error("Name and message are required.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "ai-bot" }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Message sent successfully! ✅");
        setStep("done");
        addUserMsg(form.name + " — " + form.message);
        setTimeout(() => {
          addBotMsg("Thanks for reaching out! Saruon will contact you shortly. Stay awesome! 🔥");
        }, 400);
        setForm({ name: "", phone: "", message: "" });
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleReset = () => {
    setStep("welcome");
    setInterest("");
    setMessages([
      {
        sender: "bot",
        text: "👋 Hey again! I'm Saruon's AI assistant. Ready to explore?",
      },
    ]);
  };

  const toggleOpen = () => {
    setOpen(!open);
    if (open) setMinimized(false);
  };

  return (
    <>
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-neon text-black shadow-neon-lg hover:shadow-neon-xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95 animate-float group"
        aria-label="Open AI Assistant"
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {open && (
        <div
          className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] 
            bg-cyber-dark/95 backdrop-blur-xl border border-neon/20 rounded-2xl shadow-neon-lg 
            flex flex-col overflow-hidden transition-all duration-300
            ${minimized ? "h-14" : "h-[540px]"}`}
        >
          <div
            className="shrink-0 bg-gradient-to-r from-neon/20 to-transparent border-b border-cyber-border px-5 py-4 flex items-center gap-3 cursor-pointer"
            onClick={() => setMinimized(!minimized)}
          >
            <div className="w-10 h-10 rounded-full bg-neon/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-neon" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white">
                Saruon AI Assistant
              </h3>
              <p className="text-[11px] text-neon/70 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
                Online — Let's chat!
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${minimized ? "rotate-180" : ""}`}
            />
          </div>

          {!minimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                  >
                    {msg.sender === "bot" && (
                      <div className="shrink-0 w-7 h-7 rounded-full bg-neon/10 flex items-center justify-center mr-2 mt-1">
                        <Sparkles className="w-3.5 h-3.5 text-neon" />
                      </div>
                    )}
                    <div
                      className={
                        msg.sender === "user"
                          ? "chat-bubble-user"
                          : "chat-bubble-bot"
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {step === "welcome" && (
                  <div className="flex justify-start animate-slide-up-sm">
                    <div className="flex flex-col gap-2 ml-9">
                      <button
                        onClick={handleStart}
                        className="text-xs bg-neon/10 hover:bg-neon/20 text-neon border border-neon/30 rounded-lg px-4 py-2 transition-all hover:shadow-neon-sm"
                      >
                        Let's explore what you do! 👋
                      </button>
                    </div>
                  </div>
                )}

                {step === "interest" && (
                  <div className="flex justify-start animate-slide-up-sm">
                    <div className="flex flex-col gap-2 ml-9 w-full">
                      {INTERESTS.map((item) => (
                        <button
                          key={item.key}
                          onClick={() => handleInterest(item.key, item.label)}
                          className="text-xs bg-cyber-card hover:bg-neon/10 text-gray-200 border border-cyber-border hover:border-neon/40 rounded-lg px-4 py-2.5 transition-all text-left group"
                        >
                          <span className="font-semibold text-neon group-hover:text-neon">
                            {item.emoji} {item.label}
                          </span>
                          <span className="block text-[10px] text-gray-500 mt-0.5">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === "form" && (
                  <div className="flex justify-start animate-slide-up-sm">
                    <form
                      onSubmit={handleSubmit}
                      className="w-full bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-3 ml-9"
                    >
                      <input
                        type="text"
                        placeholder="Your name *"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-cyber-charcoal border border-cyber-border rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-neon/50 transition-all"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Phone / Telegram handle"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-cyber-charcoal border border-cyber-border rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-neon/50 transition-all"
                      />
                      <textarea
                        rows={3}
                        placeholder="Your message *"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-cyber-charcoal border border-cyber-border rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-neon/50 transition-all resize-none"
                        required
                      />
                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full flex items-center justify-center gap-2 bg-neon text-black text-xs font-semibold rounded-lg px-4 py-2.5 hover:shadow-neon-sm transition-all disabled:opacity-50"
                      >
                        {sending ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" /> Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {step === "done" && (
                  <div className="flex justify-start animate-slide-up-sm">
                    <div className="flex flex-col gap-2 ml-9">
                      <button
                        onClick={handleReset}
                        className="text-xs bg-neon/10 hover:bg-neon/20 text-neon border border-neon/30 rounded-lg px-4 py-2 transition-all hover:shadow-neon-sm"
                      >
                        Start a new conversation 🔄
                      </button>
                    </div>
                  </div>
                )}

                <div ref={chatEnd} />
              </div>

              <div className="shrink-0 border-t border-cyber-border px-4 py-2.5">
                <p className="text-[10px] text-gray-500 text-center font-mono">
                  Replies typically within 24 hrs •{" "}
                  <a
                    href="https://t.me/saruon51Ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon/60 hover:text-neon transition-colors"
                  >
                    @saruon51Ai
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
