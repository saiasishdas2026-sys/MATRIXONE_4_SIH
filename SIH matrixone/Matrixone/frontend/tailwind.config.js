/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        accent: {
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        dark: {
          900: "#0a0f1e",
          800: "#0f172a",
          700: "#1e293b",
          600: "#334155",
        },
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        canvas: {
          DEFAULT: 'var(--bg-canvas, #f8fafc)',
          deep: 'var(--bg-canvas-deep, #f1f5f9)',
          elevated: 'var(--bg-canvas-elevated, #ffffff)',
        },
        surface: {
          DEFAULT: 'var(--bg-surface, #ffffff)',
          subtle: 'var(--bg-surface-subtle, #f8fafc)',
          card: 'var(--bg-surface-card, #ffffff)',
          active: 'var(--bg-surface-active, #f1f5f9)',
          highlight: 'var(--bg-surface-highlight, #e2e8f0)',
        },
        telemetry: {
          cyan: 'var(--telemetry-cyan, #0284c7)',
          'cyan-bright': 'var(--telemetry-cyan-bright, #0369a1)',
          'cyan-glow': 'var(--telemetry-cyan-glow, rgba(2, 132, 199, 0.15))',
          emerald: 'var(--telemetry-emerald, #059669)',
          'emerald-bright': 'var(--telemetry-emerald-bright, #047857)',
          'emerald-glow': 'var(--telemetry-emerald-glow, rgba(5, 150, 105, 0.15))',
          amber: 'var(--telemetry-amber, #d97706)',
          'amber-bright': 'var(--telemetry-amber-bright, #b45309)',
          'amber-glow': 'var(--telemetry-amber-glow, rgba(217, 119, 6, 0.15))',
          crimson: 'var(--telemetry-crimson, #dc2626)',
          'crimson-bright': 'var(--telemetry-crimson-bright, #b91c1c)',
        },
        seam: {
          subtle: 'var(--border-subtle, rgba(0, 0, 0, 0.06))',
          active: 'var(--border-active, rgba(2, 132, 199, 0.35))',
          border: 'var(--border-seam, #e2e8f0)',
          metallic: 'var(--border-metallic, #cbd5e1)',
        },
        ink: {
          primary: 'var(--text-ink-primary, #0f172a)',
          secondary: 'var(--text-ink-secondary, #334155)',
          muted: 'var(--text-ink-muted, #64748b)',
          faint: 'var(--text-ink-faint, #94a3b8)',
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)",
        "hero-gradient":
          "radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.08) 0%, transparent 50%)",
      },
      backgroundSize: {
        "grid-pattern": "40px 40px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-right": "slideRight 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 4s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-12px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(2,132,199,0.3)" },
          "100%": { boxShadow: "0 0 15px rgba(2,132,199,0.5)" },
        },
      },
      boxShadow: {
        "soft": "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        "elevated": "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.07)",
        "glow-blue": "0 0 15px rgba(37,99,235,0.25)",
        "cyan-glow": "0 0 15px -3px var(--telemetry-cyan-glow, rgba(2, 132, 199, 0.2))",
        "emerald-glow": "0 0 15px -3px var(--telemetry-emerald-glow, rgba(5, 150, 105, 0.2))",
        "amber-glow": "0 0 15px -3px var(--telemetry-amber-glow, rgba(217, 119, 6, 0.2))",
        "card": "var(--shadow-card, 0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06))",
      },
    },
  },
  plugins: [],
};
