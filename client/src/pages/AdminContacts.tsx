import { useState, useEffect } from "react";
import { MessageSquare, Mail, Trash2, CheckCheck, Clock } from "lucide-react";
import toast from "react-hot-toast";

const API = "/api";

interface Contact {
  _id: string;
  name: string;
  phone: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/contacts`);
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch {
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const markRead = async (id: string) => {
    try {
      await fetch(`${API}/admin/contacts/${id}/read`, { method: "PUT" });
      fetchContacts();
    } catch {
      toast.error("Failed to update.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await fetch(`${API}/admin/contacts/${id}`, { method: "DELETE" });
      toast.success("Message deleted.");
      fetchContacts();
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="min-h-screen bg-cyber-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="w-7 h-7 text-neon" />
          <h1 className="text-3xl font-bold text-white">Contact Messages</h1>
        </div>

        <div className="card-cyber overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cyber-border text-gray-400">
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">
                    Phone
                  </th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                    Message
                  </th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : contacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      No messages yet.
                    </td>
                  </tr>
                ) : (
                  contacts.map((c) => (
                    <tr
                      key={c._id}
                      className={`border-b border-cyber-border hover:bg-white/5 transition-colors ${
                        !c.read ? "bg-neon/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        {c.read ? (
                          <CheckCheck className="w-4 h-4 text-neon" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-400" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-white font-medium">
                        {c.name}
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">
                        {c.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell max-w-xs truncate">
                        {c.message}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!c.read && (
                            <button
                              onClick={() => markRead(c._id)}
                              className="p-1.5 text-gray-400 hover:text-neon transition-colors"
                              title="Mark as read"
                            >
                              <CheckCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(c._id)}
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
