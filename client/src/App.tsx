import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AiBotWidget from "./components/AiBotWidget";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBlog from "./pages/AdminBlog";
import AdminContacts from "./pages/AdminContacts";
import AdminNewsletter from "./pages/AdminNewsletter";

export default function App() {
  return (
    <div className="min-h-screen bg-cyber-black flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0a0a0f",
            color: "#fff",
            border: "1px solid #1a1a2e",
          },
          success: {
            iconTheme: { primary: "#00FF66", secondary: "#000" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#000" },
          },
        }}
      />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/contacts" element={<AdminContacts />} />
          <Route path="/admin/newsletter" element={<AdminNewsletter />} />
        </Routes>
      </main>
      <Footer />
      <AiBotWidget />
    </div>
  );
}
