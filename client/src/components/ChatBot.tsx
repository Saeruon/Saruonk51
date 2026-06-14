import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const API = "/api";

type Step = "welcome" | "ask-pillar" | "ask-name" | "ask-contact" | "ask-message" | "done";

interface Message {
  role: "bot" | "user";
  text: string;
}

const PILLARS = [
  { label: "Content Creation", desc: "Digital branding, visual effects, content strategy" },
  { label: "Algorithmic Trading", desc: "Forex & Gold automated trading, MT5 EAs" },
  { label: "Real Estate", desc: "Phnom Penh shop houses, premium properties" },
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("welcome");
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pillar, setPillar] = useState("");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setMinimized(false);
      if (messages.length === 0) {
        setTimeout(() => {
          setMessages([
            { role: "bot", text: "👋 Hello! I'm Saruon's AI Assistant." },
            { role: "bot", text: "I'm here to help you explore my work. Which area interests you?" },
          ]);
          setStep("ask-pillar");
        }, 500);
      }
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addBot = (text: string) => setMessages((m) => [...m, { role: "bot", text }]);
  const addUser = (text: string) => setMessages((m) => [...m, { role: "user", text }]);

  const handlePillarSelect = (p: string) => {
    setPillar(p);
    addUser(p);
    setTimeout(() => {
      addBot(`Great choice! You're interested in **${p}**!`);
      setTimeout(() => {
        addBot("What's your name so I can connect you with Saruon?");
        setStep("ask-name");
      }, 600);
    }, 400);
  };

  const handleNameSubmit = () => {
    const val = input.trim();
    if (!val) return;
    setName(val);
    addUser(val);
    setInput("");
    setTimeout(() => {
      addBot(`Nice to meet you, ${val}! What's your Telegram handle or phone number?`);
      setStep("ask-contact");
    }, 500);
  };

  const handleContactSubmit = () => {
    const val = input.trim();
    if (!val) return;
    setPhone(val);
    addUser(val);
    setInput("");
    setTimeout(() => {
      addBot("Perfect! What message would you like to send to Saruon?");
      setStep("ask-message");
    }, 500);
  };

  const handleMessageSubmit = async () => {
    const val = input.trim();
    if (!val) return;
    addUser(val);
    setInput("");
    setSending(true);
    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          message: `[${pillar}] ${val}`,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Message sent successfully!");
        addBot("✅ Your message has been sent to Saruon! He'll get back to you soon.");
        addBot("Feel free to explore the website in the meantime! 🚀");
      } else {
        toast.error(data.error || "Failed to send");
        addBot("Something went wrong. Please try the contact form directly.");
      }
    } catch {
      toast.error("Network error. Please try again.");
      addBot("Network error. Please try the contact form below.");
    } finally {
      setSending(false);
      setStep("done");
    }
  };

  const handleSend = () => {
    if (step === "ask-name") handleNameSubmit();
    else if (step === "ask-contact") handleContactSubmit();
    else if (step === "ask-message") handleMessageSubmit();
  };

  const reset = () => {
    setMessages([]);
    setName("");
    setPhone("");
    setPillar("");
    setInput("");
    setStep("welcome");
    setTimeout(() => {
      setMessages([
        { role: "bot", text: "👋 Hello! I'm Saruon's AI Assistant." },
        { role: "bot", text: "I'm here to help you explore my work. Which area interests you?" },
      ]);
      setStep("ask-pillar");
    }, 300);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-neon text-cyber-black shadow-neon-lg
                   flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Toggle AI Assistant"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] 
                      glass-card overflow-hidden transition-all duration-300
                      ${minimized ? "h-14" : "h-[520px]"}`}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-cyber-border/50 bg-cyber-dark/80 cursor-pointer"
            onClick={() => setMinimized(!minimized)}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-neon/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-neon" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Assistant</p>
                <p className="text-[10px] text-neon/70">Online</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${minimized ? "rotate-180" : ""}`} />
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[380px]">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-neon/15 text-white border border-neon/20"
                          : "bg-cyber-dark/80 text-gray-200 border border-cyber-border/30"
                      }`}
                    >
                      {msg.role === "bot" && (
                        <span className="text-neon text-xs font-bold mr-1.5">🤖</span>
                      )}
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Pillar selection buttons */}
                {step === "ask-pillar" && messages.length <= 3 && (
                  <div className="flex flex-col gap-2 mt-1">
                    {PILLARS.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => handlePillarSelect(p.label)}
                        className="text-left px-4 py-2.5 rounded-xl bg-cyber-dark/60 border border-cyber-border/40
                                   hover:border-neon/40 hover:bg-neon/5 text-gray-300 hover:text-white
                                   transition-all text-sm group"
                      >
                        <span className="font-semibold text-neon group-hover:text-neon">▸ {p.label}</span>
                        <span className="block text-xs text-gray-500 mt-0.5">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Input prompt */}
                {(step === "ask-name" || step === "ask-contact" || step === "ask-message") && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder={
                        step === "ask-name"
                          ? "Type your name..."
                          : step === "ask-contact"
                          ? "Telegram handle or phone..."
                          : "Write your message..."
                      }
                      className="flex-1 bg-cyber-dark/80 border border-cyber-border/40 rounded-xl px-3 py-2 text-sm text-white
                                 placeholder-gray-600 outline-none focus:border-neon/40 transition-all"
                      autoFocus
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || sending}
                      className="p-2 rounded-xl bg-neon/20 text-neon hover:bg-neon/30 border border-neon/20
                                 disabled:opacity-30 transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {step === "done" && (
                  <button
                    onClick={reset}
                    className="w-full mt-2 px-4 py-2.5 rounded-xl bg-neon/10 border border-neon/20 text-neon text-sm
                               font-medium hover:bg-neon/20 transition-all"
                  >
                    Start New Conversation
                  </button>
                )}

                <div ref={endRef} />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
