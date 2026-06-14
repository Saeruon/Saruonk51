import { useState, useEffect } from "react";
import { Users, Trash2, Mail } from "lucide-react";
import toast from "react-hot-toast";

const API = "/api";

interface Subscriber {
  _id: string;
  email: string;
  createdAt: string;
}

export default function AdminNewsletter() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/newsletter`);
      const data = await res.json();
      setSubs(Array.isArray(data) ? data : []);
    } catch {
      setSubs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    try {
      await fetch(`${API}/admin/newsletter/${id}`, { method: "DELETE" });
      toast.success("Subscriber removed.");
      fetchSubs();
    } catch {
      toast.error("Failed to remove.");
    }
  };

  return (
    <div className="min-h-screen bg-cyber-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Users className="w-7 h-7 text-neon" />
          <h1 className="text-3xl font-bold text-white">Newsletter Subscribers</h1>
        </div>

        <div className="card-cyber overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cyber-border text-gray-400">
                  <th className="text-left px-4 py-3 font-medium">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                    Subscribed
                  </th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-12 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : subs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-12 text-gray-500">
                      No subscribers yet.
                    </td>
                  </tr>
                ) : (
                  subs.map((s) => (
                    <tr
                      key={s._id}
                      className="border-b border-cyber-border hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-white">{s.email}</td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                        {new Date(s.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Total: <span className="text-white font-medium">{subs.length}</span>{" "}
          subscriber{subs.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
