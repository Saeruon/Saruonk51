import { Link } from "react-router-dom";
import {
  Code,
  Phone,
  Send,
  MapPin,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-cyber-border/60 bg-cyber-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold mb-4"
            >
              <Code className="w-6 h-6 text-neon" />
              <span>
                SARUON<span className="text-neon">.</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Digital Creator &bull; Algorithmic Trader &bull; Real Estate Specialist
            </p>
            <p className="text-gray-500 text-xs mt-2">Phnom Penh, Cambodia</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/blog", label: "Blog" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-gray-400 hover:text-neon text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-neon shrink-0" />
                <a
                  href="tel:+85570652338"
                  className="hover:text-neon transition-colors"
                >
                  +855 70 652 338
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-neon/60 shrink-0" />
                <a
                  href="tel:+855964183737"
                  className="hover:text-neon transition-colors"
                >
                  +855 96 418 3737
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Send className="w-4 h-4 text-telegram shrink-0" />
                <span>
                  Admin:{" "}
                  <a
                    href="https://t.me/saruon51Ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-telegram transition-colors"
                  >
                    @saruon51Ai
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-neon shrink-0" />
                Phnom Penh, Cambodia
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <MessageCircle className="w-4 h-4 text-telegram shrink-0" />
                <a
                  href="https://t.me/ShopHouseinCityPhnomPenh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-telegram transition-colors"
                >
                  Shop House Group
                </a>
                <ExternalLink className="w-3 h-3 text-telegram/60" />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cyber-border/40 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Saruon Ros. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
