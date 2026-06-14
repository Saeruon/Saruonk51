import { useState, useEffect } from "react";
import { Search, Tag, RefreshCw } from "lucide-react";
import BlogCard from "../components/BlogCard";

const API = "/api";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  createdAt: string;
}

const categories = ["All", "Digital Art", "Real Estate", "News", "General"];

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (search) params.set("search", search);

    fetch(`${API}/blogs?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setBlogs(Array.isArray(data) ? data : []);
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="min-h-screen bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            <span className="text-glow">The</span>{" "}
            <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Insights on digital creation, real estate market trends, and
            updates from Phnom Penh.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-cyber pl-11"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  category === cat
                    ? "bg-neon/10 text-neon border border-neon/30"
                    : "bg-cyber-card text-gray-400 border border-cyber-border hover:border-gray-600"
                }`}
              >
                {cat === "All" ? (
                  <RefreshCw className="w-3.5 h-3.5" />
                ) : (
                  <Tag className="w-3.5 h-3.5" />
                )}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 mt-4">Loading articles...</p>
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} {...blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No articles found.</p>
            <p className="text-gray-600 text-sm mt-1">
              Try a different search or category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
