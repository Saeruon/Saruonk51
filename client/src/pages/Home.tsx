import { useState, useEffect, useCallback } from "react";
import {
  Send,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  Users,
  Layers,
  Camera,
  BarChart3,
  Building2,
  Phone,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Terminal,
  Globe,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import BlogCard from "../components/BlogCard";

const API = "/api";

const TYPING_WORDS = [
  "Digital Content Creator",
  "Algorithmic Forex & Gold (XAUUSD) Trader",
  "Phnom Penh Real Estate Specialist",
];

const STATS_DATA = [
  { label: "Followers", value: "5.5K", suffix: "+", icon: Users },
  { label: "Active Projects", value: "48", suffix: "", icon: TrendingUp },
  { label: "Market Outputs", value: "2.2K", suffix: "+", icon: Layers },
];

const SKILLS = [
  {
    title: "Content Creation",
    icon: Camera,
    focus: "Digital Branding & Visual Effects",
    color: "from-neon/20 to-transparent",
    borderColor: "border-neon/20 group-hover:border-neon/40",
    items: [
      "Digital branding & identity design",
      "Cinematic visual effects & motion graphics",
      "Custom content strategy for local & global markets",
      "Social media growth & audience engagement",
    ],
  },
  {
    title: "Algorithmic Trading",
    icon: BarChart3,
    focus: "Forex & Gold Automated Systems",
    color: "from-neon/20 to-transparent",
    borderColor: "border-neon/20 group-hover:border-neon/40",
    items: [
      "Automated trading systems & Expert Advisors (EAs)",
      "MT5 strategy development & optimization",
      "Technical scalping & hedging for XAUUSD",
      "Advanced Forex market analysis & execution",
    ],
  },
  {
    title: "Real Estate Marketing",
    icon: Building2,
    focus: "Phnom Penh Premium Properties",
    color: "from-neon/20 to-transparent",
    borderColor: "border-neon/20 group-hover:border-neon/40",
    items: [
      "Modern shop houses for rent & sale",
      "Premium locations in Phnom Penh",
      "Investment consultation & market insights",
      "Direct channel — @ShopHouseinCityPhnomPenh",
    ],
  },
];

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  createdAt: string;
}

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [typed, setTyped] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0]);

  useEffect(() => {
    const word = TYPING_WORDS[wordIdx];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < word.length) {
      timer = setTimeout(() => {
        setTyped((prev) => prev + word[charIdx]);
        setCharIdx((c) => c + 1);
      }, 60);
    } else if (!deleting && charIdx === word.length) {
      timer = setTimeout(() => setDeleting(true), 2500);
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => {
        setTyped((prev) => prev.slice(0, -1));
        setCharIdx((c) => c - 1);
      }, 30);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((w) => (w + 1) % TYPING_WORDS.length);
    }

    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx]);

  useEffect(() => {
    const targets = [5500, 48, 2200];
    const durations = [2000, 1500, 2000];
    const startTimes = [0, 300, 600];

    const anim = (i: number) => {
      const start = performance.now() + startTimes[i];
      const duration = durations[i];
      const target = targets[i];

      const frame = (now: number) => {
        if (now < start) return requestAnimationFrame(frame);
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCounts((c) => {
          const next = [...c];
          next[i] = Math.round(eased * target);
          return next;
        });
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };

    const timers = [0, 1, 2].map((i) => setTimeout(() => anim(i), 500));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    fetch(`${API}/blogs?limit=3`)
      .then((r) => r.json())
      .then((data) => setBlogs(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(data.message || "Message sent!");
          setForm({ name: "", phone: "", message: "" });
        } else {
          toast.error(data.error || "Something went wrong.");
        }
      } catch {
        toast.error("Network error. Please try again.");
      } finally {
        setSending(false);
      }
    },
    [form]
  );

  const formatCount = (n: number, suffix: string) => {
    if (n >= 1000) {
      return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K" + suffix;
    }
    return n + suffix;
  };

  return (
    <div className="bg-grid-lg">
      {/* ═══════════════════════════════════════════════════
          HERO SECTION
         ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20">
        {/* Ambient glow orbs */}
        <div className="absolute inset-0 bg-gradient-to-b from-neon/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-neon/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-neon/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon/20 bg-neon/5 text-neon text-xs font-mono tracking-wider mb-6 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5" />
              MULTI-DIMENSIONAL CREATOR
            </div>

            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none mb-4 animate-slide-up">
              <span className="text-glow-intense">SARUON</span>{" "}
              <span className="text-neon glow">ROS</span>
            </h1>

            <div className="h-12 md:h-14 flex items-center justify-center mb-8">
              <span className="text-lg sm:text-xl md:text-2xl text-gray-400 font-mono">
                <span className="text-neon/80 font-bold">&gt; </span>
                <span>{typed}</span>
                <span className="inline-block w-0.5 h-5 md:h-6 bg-neon ml-0.5 animate-blink shadow-neon-sm" />
              </span>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mb-12 animate-slide-up-lg">
              <a href="#contact" className="btn-neon text-base group">
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                Connect With Me
              </a>
              <a
                href="https://t.me/ShopHouseinCityPhnomPenh"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-base group"
              >
                <MessageCircle className="w-4 h-4" />
                Join My Channel
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto w-full">
              {STATS_DATA.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="glass-card p-5 md:p-7 text-center group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                      <Icon className="w-6 h-6 md:w-8 md:h-8 text-neon/60 mx-auto mb-2 group-hover:text-neon group-hover:scale-110 transition-all duration-300" />
                      <div className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                        {formatCount(counts[i], stat.suffix)}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 mt-1 tracking-wider uppercase">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          THE 3 SKILLS SHOWCASE GRID
         ═══════════════════════════════════════════════════ */}
      <section id="skills" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-neon text-sm font-mono tracking-[0.2em] mb-3">
              // CORE PILLARS
            </p>
            <h2 className="section-title">
              What I <span className="gradient-text">Do</span>
            </h2>
            <p className="section-subtitle">
              Three domains. One mission — create impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {SKILLS.map((skill) => {
              const Icon = skill.icon;
              return (
                <div
                  key={skill.title}
                  className="group relative glass-card overflow-hidden p-0.5 transition-all duration-500 hover:scale-[1.02]"
                  style={{ borderColor: "rgba(0, 255, 102, 0.2)" }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-b ${skill.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon/5 rounded-full blur-2xl group-hover:bg-neon/10 transition-all duration-700" />
                  <div className="relative bg-cyber-card/60 backdrop-blur-sm rounded-[calc(1rem-1px)] p-8 h-full flex flex-col">
                    <div className="w-14 h-14 rounded-2xl bg-neon/5 border border-cyber-border flex items-center justify-center mb-5 group-hover:bg-neon/10 group-hover:border-neon/20 group-hover:shadow-neon-sm transition-all duration-500">
                      <Icon className="w-7 h-7 text-neon" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">
                      {skill.title}
                    </h3>
                    <p className="text-xs text-neon/70 font-mono mb-4 tracking-wider">
                      // {skill.focus}
                    </p>

                    <ul className="space-y-2.5 mb-6 flex-1">
                      {skill.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm text-gray-400 group-hover:text-gray-300 transition-colors"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-neon/60 mt-0.5 shrink-0 group-hover:text-neon transition-colors" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    {skill.title === "Real Estate Marketing" ? (
                      <a
                        href="https://t.me/ShopHouseinCityPhnomPenh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-telegram w-full justify-center text-sm group/btn"
                      >
                        <Send className="w-4 h-4" /> Join Channel
                        <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      </a>
                    ) : (
                      <a
                        href="#contact"
                        className="btn-outline w-full justify-center text-sm group/btn"
                      >
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                        Learn More
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          RECENT BLOGS
         ═══════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-cyber-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-neon text-sm font-mono tracking-[0.2em] mb-3">
                // LATEST
              </p>
              <h2 className="section-title">
                Recent <span className="gradient-text">Updates</span>
              </h2>
              <p className="section-subtitle mb-0">
                Insights, market analysis & creative works.
              </p>
            </div>
            <a
              href="/blog"
              className="hidden sm:flex items-center gap-1 text-neon text-sm font-medium hover:underline group"
            >
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {blogs.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} {...blog} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Getting Started with Digital Creation",
                  excerpt:
                    "How I transitioned from traditional design to full digital content creation in Cambodia's growing market.",
                  category: "Digital Art",
                  slug: "getting-started",
                  createdAt: new Date().toISOString(),
                },
                {
                  title: "XAUUSD Trading Strategies for 2026",
                  excerpt:
                    "Algorithmic approaches to gold trading — combining technical analysis with automated execution.",
                  category: "Trading",
                  slug: "xauusd-strategies",
                  createdAt: new Date().toISOString(),
                },
                {
                  title: "Shop House Market Trends in Phnom Penh",
                  excerpt:
                    "Current pricing, demand hotspots, and what investors need to know this year.",
                  category: "Real Estate",
                  slug: "shop-house-trends",
                  createdAt: new Date().toISOString(),
                },
              ].map((blog, i) => (
                <BlogCard key={i} {...(blog as Blog)} />
              ))}
            </div>
          )}

          <a
            href="/blog"
            className="sm:hidden flex items-center justify-center gap-1 text-neon text-sm font-medium mt-6 hover:underline group"
          >
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CONTACT SECTION
         ═══════════════════════════════════════════════════ */}
      <section id="contact" className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon/[0.02] to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-14">
            <p className="text-neon text-sm font-mono tracking-[0.2em] mb-3">
              // GET IN TOUCH
            </p>
            <h2 className="section-title">
              Let's <span className="gradient-text">Connect</span>
            </h2>
            <p className="section-subtitle">
              Reach out directly or use the AI assistant in the bottom-right corner.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-5">
              <div className="glass-card p-6 space-y-5">
                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-neon" />
                  Contact Info
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-neon/10 flex items-center justify-center shrink-0 group-hover:bg-neon/20 group-hover:shadow-neon-sm transition-all">
                      <Phone className="w-5 h-5 text-neon" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-mono">Primary Mobile</p>
                      <a
                        href="tel:+85570652338"
                        className="text-sm text-white hover:text-neon transition-colors"
                      >
                        +855 70 652 338
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-neon/5 flex items-center justify-center shrink-0 group-hover:bg-neon/10 group-hover:shadow-neon-sm transition-all">
                      <Phone className="w-5 h-5 text-neon/70" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-mono">Secondary Mobile</p>
                      <a
                        href="tel:+855964183737"
                        className="text-sm text-white hover:text-neon transition-colors"
                      >
                        +855 96 418 3737
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-neon/10 flex items-center justify-center shrink-0 group-hover:bg-neon/20 group-hover:shadow-neon-sm transition-all">
                      <Send className="w-5 h-5 text-neon" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-mono">Admin Telegram</p>
                      <a
                        href="https://t.me/saruon51Ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white hover:text-neon transition-colors"
                      >
                        @saruon51Ai
                      </a>
                    </div>
                  </li>
                </ul>
              </div>

              <a
                href="https://t.me/ShopHouseinCityPhnomPenh"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-telegram w-full justify-center group"
              >
                <Send className="w-4 h-4" /> Join Shop House Group
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            <form
              onSubmit={handleSubmit}
              className="md:col-span-3 glass-card p-6 md:p-8 space-y-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-neon" />
                <h3 className="text-lg font-semibold text-white">Send a Message</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5 font-mono">
                  Name <span className="text-neon">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-cyber"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5 font-mono">
                  Phone / Telegram
                </label>
                <input
                  type="text"
                  placeholder="@username or phone number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-cyber"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5 font-mono">
                  Message <span className="text-neon">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell me about your project, trading interests, or property needs..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="input-cyber resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="btn-neon w-full justify-center disabled:opacity-50 group"
              >
                {sending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
