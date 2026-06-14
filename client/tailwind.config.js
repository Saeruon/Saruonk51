/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          DEFAULT: "#00FF66",
          dark: "#00CC52",
          glow: "rgba(0, 255, 102, 0.4)",
        },
        cyber: {
          black: "#000000",
          charcoal: "#050508",
          dark: "#0a0a0f",
          card: "#0d0d14",
          border: "#1a1a2e",
        },
        telegram: {
          DEFAULT: "#0088cc",
          dark: "#006699",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        "neon-sm": "0 0 10px rgba(0, 255, 102, 0.3)",
        neon: "0 0 20px rgba(0, 255, 102, 0.4)",
        "neon-lg": "0 0 40px rgba(0, 255, 102, 0.5)",
        "neon-xl": "0 0 60px rgba(0, 255, 102, 0.6)",
        "neon-2xl": "0 0 80px rgba(0, 255, 102, 0.7)",
        "inner-neon": "inset 0 0 20px rgba(0, 255, 102, 0.15)",
      },
      animation: {
        "pulse-neon": "pulseNeon 2s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "glow-intense": "glowIntense 1.5s ease-in-out infinite alternate",
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-up-sm": "slideUpSm 0.4s ease-out",
        "slide-up-lg": "slideUpLg 0.8s ease-out",
        typing: "typing 3.5s steps(40) 1s forwards",
        blink: "blink 0.75s step-end infinite",
        float: "float 6s ease-in-out infinite",
        "scanline": "scanline 8s linear infinite",
        "grid-move": "gridMove 20s linear infinite",
        "border-flow": "borderFlow 3s linear infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        pulseNeon: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0, 255, 102, 0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(0, 255, 102, 0.6)" },
        },
        glow: {
          "0%": { textShadow: "0 0 10px rgba(0, 255, 102, 0.5)" },
          "100%": { textShadow: "0 0 40px rgba(0, 255, 102, 0.9), 0 0 80px rgba(0, 255, 102, 0.4)" },
        },
        glowIntense: {
          "0%": { textShadow: "0 0 20px rgba(0, 255, 102, 0.6), 0 0 40px rgba(0, 255, 102, 0.3)" },
          "100%": { textShadow: "0 0 40px rgba(0, 255, 102, 0.9), 0 0 80px rgba(0, 255, 102, 0.5), 0 0 120px rgba(0, 255, 102, 0.3)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUpSm: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUpSm: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUpLg: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        typing: {
          "from": { width: "0" },
          "to": { width: "100%" },
        },
        blink: {
          "50%": { borderColor: "transparent" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        gridMove: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(40px, 40px)" },
        },
        borderFlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};
