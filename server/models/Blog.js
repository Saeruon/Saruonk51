import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Digital Art", "Real Estate", "News", "General"],
      default: "General",
    },
    coverImage: { type: String, default: "" },
    published: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
