import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Pin,
} from "lucide-react";
import toast from "react-hot-toast";

const API = "/api";

interface Blog {
  _id: string;
  title: string;
  category: string;
  published: boolean;
  pinned: boolean;
  createdAt: string;
}

export default function AdminBlog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "General",
    published: false,
    pinned: false,
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/blogs`);
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "General",
      published: false,
      pinned: false,
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (blog: Blog) => {
    setForm({
      title: blog.title,
      slug: blog.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      excerpt: "",
      content: "",
      category: blog.category,
      published: blog.published,
      pinned: blog.pinned,
    });
    setEditing(blog._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    const payload = {
      ...form,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    };

    try {
      const url = editing
        ? `${API}/blogs/${editing}`
        : `${API}/blogs`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(editing ? "Blog updated!" : "Blog created!");
        resetForm();
        fetchBlogs();
      } else {
        const data = await res.json();
        toast.error(data.error || "Something went wrong.");
      }
    } catch {
      toast.error("Network error.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      await fetch(`${API}/blogs/${id}`, { method: "DELETE" });
      toast.success("Blog deleted.");
      fetchBlogs();
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const togglePublish = async (blog: Blog) => {
    try {
      await fetch(`${API}/blogs/${blog._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !blog.published }),
      });
      fetchBlogs();
    } catch {
      toast.error("Failed to update.");
    }
  };

  return (
    <div className="min-h-screen bg-cyber-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FileText className="w-7 h-7 text-neon" />
            <h1 className="text-3xl font-bold text-white">Blog Manager</h1>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-neon"
          >
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card-cyber p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-5">
              {editing ? "Edit Post" : "Create Post"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className="input-cyber"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="input-cyber"
                  >
                    {["General", "Digital Art", "Real Estate", "News"].map(
                      (c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value })
                  }
                  placeholder="Auto-generated from title"
                  className="input-cyber"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Excerpt
                </label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm({ ...form, excerpt: e.target.value })
                  }
                  className="input-cyber resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Content (Markdown supported)
                </label>
                <textarea
                  rows={8}
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  className="input-cyber resize-none font-mono text-sm"
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) =>
                      setForm({ ...form, published: e.target.checked })
                    }
                    className="accent-neon"
                  />
                  Published
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={form.pinned}
                    onChange={(e) =>
                      setForm({ ...form, pinned: e.target.checked })
                    }
                    className="accent-neon"
                  />
                  Pinned
                </label>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-neon">
                  {editing ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="card-cyber overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cyber-border text-gray-400">
                  <th className="text-left px-4 py-3 font-medium">Title</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">
                    Category
                  </th>
                  <th className="text-center px-4 py-3 font-medium hidden md:table-cell">
                    Status
                  </th>
                  <th className="text-center px-4 py-3 font-medium hidden md:table-cell">
                    Pin
                  </th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : blogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500">
                      No blog posts yet.
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr
                      key={blog._id}
                      className="border-b border-cyber-border hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-white font-medium">
                        {blog.title}
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">
                        <span className="px-2 py-0.5 bg-neon/10 text-neon text-xs rounded-full">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <button
                          onClick={() => togglePublish(blog)}
                          className={`inline-flex items-center gap-1 text-xs font-medium ${
                            blog.published
                              ? "text-neon"
                              : "text-gray-500"
                          }`}
                        >
                          {blog.published ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                          {blog.published ? "Live" : "Draft"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        {blog.pinned && (
                          <Pin className="w-3.5 h-3.5 text-yellow-400 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(blog)}
                            className="p-1.5 text-gray-400 hover:text-neon transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
