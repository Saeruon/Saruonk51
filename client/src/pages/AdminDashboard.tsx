import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Mail,
  Users,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

const API = "/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    contacts: 0,
    subscribers: 0,
    blogs: 0,
    unread: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch(`${API}/admin/contacts`).then((r) => r.json()),
      fetch(`${API}/admin/newsletter`).then((r) => r.json()),
      fetch(`${API}/admin/blogs`).then((r) => r.json()),
    ])
      .then(([contacts, subs, blogs]) => {
        const contactsArr = Array.isArray(contacts) ? contacts : [];
        const subsArr = Array.isArray(subs) ? subs : [];
        const blogsArr = Array.isArray(blogs) ? blogs : [];
        setStats({
          contacts: contactsArr.length,
          subscribers: subsArr.length,
          blogs: blogsArr.length,
          unread: contactsArr.filter((c: { read: boolean }) => !c.read).length,
        });
      })
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: "Total Blogs",
      value: stats.blogs,
      icon: FileText,
      color: "text-neon",
      bg: "bg-neon/10",
      to: "/admin/blog",
    },
    {
      label: "Messages",
      value: stats.contacts,
      icon: MessageSquare,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      to: "/admin/contacts",
    },
    {
      label: "Unread",
      value: stats.unread,
      icon: Mail,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      to: "/admin/contacts",
    },
    {
      label: "Subscribers",
      value: stats.subscribers,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      to: "/admin/newsletter",
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-10">
          <LayoutDashboard className="w-7 h-7 text-neon" />
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                to={card.to}
                className="card-cyber p-6 group hover:border-neon/30 transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className="text-2xl font-bold text-white group-hover:text-neon transition-colors">
                  {card.value}
                </div>
                <div className="text-sm text-gray-400 mt-1">{card.label}</div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="card-cyber p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-neon" />
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              to="/admin/blog"
              className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-neon/10 border border-cyber-border hover:border-neon/30 transition-all"
            >
              <FileText className="w-5 h-5 text-neon" />
              <span className="text-sm font-medium text-gray-300">
                Manage Blogs
              </span>
            </Link>
            <Link
              to="/admin/contacts"
              className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-telegram/10 border border-cyber-border hover:border-telegram/30 transition-all"
            >
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">
                View Messages
              </span>
            </Link>
            <Link
              to="/admin/newsletter"
              className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-purple-400/10 border border-cyber-border hover:border-purple-400/30 transition-all"
            >
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">
                Subscribers
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
