import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import rateLimit from "express-rate-limit";
import Blog from "./models/Blog.js";
import Contact from "./models/Contact.js";
import Newsletter from "./models/Newsletter.js";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5000;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || "";
const TELEGRAM_ENABLED = !!(TELEGRAM_BOT_TOKEN && TELEGRAM_ADMIN_CHAT_ID);

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/saruonk51")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.log("Server will run without database.");
  });

// ─── TELEGRAM NOTIFICATION ─────────────────────────────────

async function sendTelegramNotification(contact) {
  if (!TELEGRAM_ENABLED) return;
  try {
    const sourceIcon = contact.source === "ai-bot" ? "🤖" : "📋";
    const sourceLabel = contact.source === "ai-bot" ? "AI Assistant Chat" : "Contact Form";
    const createdAt = contact.createdAt
      ? new Date(contact.createdAt).toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" })
      : new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" });

    const text = [
      `┌─────────────────────────────────`,
      `│ ${sourceIcon}  *NEW ${sourceLabel.toUpperCase()}*`,
      `├─────────────────────────────────`,
      `│`,
      `│  *👤 Name:* ${contact.name || "N/A"}`,
      `│  *📱 Phone:* ${contact.phone || "N/A"}`,
      `│  *💬 Message:* ${contact.message || "N/A"}`,
      `│`,
      `│  *📎 Source:* ${sourceLabel}`,
      `│  *🕐 Time:* ${createdAt}`,
      `│`,
      `└─────────────────────────────────`,
    ].join("\n");

    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_ADMIN_CHAT_ID,
          text,
          parse_mode: "Markdown",
        }),
      }
    );
  } catch (err) {
    console.error("Telegram notification failed:", err.message);
  }
}

// ─── BLOG ROUTES ────────────────────────────────────────────

app.get("/api/blogs", async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { published: true };
    if (category && category !== "All") filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };
    const blogs = await Blog.find(filter)
      .sort({ pinned: -1, createdAt: -1 })
      .select("-content");
    res.json(blogs);
  } catch {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

app.get("/api/blogs/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

app.post("/api/blogs", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch {
    res.status(400).json({ error: "Failed to create blog" });
  }
});

app.put("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch {
    res.status(400).json({ error: "Failed to update blog" });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: "Failed to delete blog" });
  }
});

app.get("/api/admin/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// ─── CONTACT ROUTES ─────────────────────────────────────────

app.post("/api/contact", async (req, res) => {
  try {
    const { name, phone, message, source } = req.body;
    const contact = await Contact.create({
      name,
      phone: phone || "",
      message,
      source: source || "contact-form",
    });
    sendTelegramNotification(contact);
    res.status(201).json({ message: "Message sent successfully!", contact });
  } catch (err) {
    console.error("Contact creation error:", err.message);
    res.status(400).json({ error: "Failed to send message" });
  }
});

app.get("/api/admin/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

app.put("/api/admin/contacts/:id/read", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(contact);
  } catch {
    res.status(400).json({ error: "Failed to update contact" });
  }
});

app.delete("/api/admin/contacts/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: "Failed to delete contact" });
  }
});

// ─── NEWSLETTER ROUTES ───────────────────────────────────────

app.post("/api/newsletter", async (req, res) => {
  try {
    const { email } = req.body;
    const existing = await Newsletter.findOne({ email });
    if (existing) return res.status(400).json({ error: "Already subscribed!" });
    await Newsletter.create({ email });
    res.status(201).json({ message: "Subscribed successfully!" });
  } catch {
    res.status(400).json({ error: "Failed to subscribe" });
  }
});

app.get("/api/admin/newsletter", async (req, res) => {
  try {
    const subs = await Newsletter.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch {
    res.status(500).json({ error: "Failed to fetch subscribers" });
  }
});

app.delete("/api/admin/newsletter/:id", async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: "Failed to delete subscriber" });
  }
});

// ─── STATS ──────────────────────────────────────────────────

app.get("/api/stats", (_req, res) => {
  res.json({
    followers: "5.5K",
    subscribers: "2.1K",
    outputs: "2219",
  });
});

// ─── START ──────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (TELEGRAM_ENABLED) {
    console.log("Telegram notifications active");
  } else {
    console.log("Telegram notifications disabled (set TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID)");
  }
});
