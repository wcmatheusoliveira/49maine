import {heroui} from "@heroui/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'headline': ['var(--font-zilla-slab)', 'serif'],
        'bebas': ['var(--font-bebas)', 'sans-serif'],
        'adventures': ['adventures-unlimited', 'serif'],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-up": "fadeUp 0.5s ease-out",
        "fade-down": "fadeDown 0.5s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "bounce-in": "bounceIn 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "70%": { transform: "scale(1.05)", opacity: "0.7" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      colors: {
        primary: {
          DEFAULT: "#144663",
          50: "#e6eef3",
          100: "#ccdde7",
          200: "#99bbcf",
          300: "#6699b7",
          400: "#33779f",
          500: "#144663",
          600: "#103a52",
          700: "#0c2d41",
          800: "#082130",
          900: "#04141f",
        },
        cream: {
          DEFAULT: "#FBF8EB",
          50: "#ffffff",
          100: "#fefdfb",
          200: "#FBF8EB",
          300: "#f7f2db",
          400: "#f3ebcb",
          500: "#efe4bb",
          600: "#ebddab",
          700: "#e7d69b",
          800: "#e3cf8b",
          900: "#dfc87b",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        sage: {
          50: "#f0f4f0",
          100: "#e1e9e1",
          200: "#c3d3c3",
          300: "#a5bda5",
          400: "#87a787",
          500: "#6b8e6b",
          600: "#567156",
          700: "#415541",
          800: "#2c382c",
          900: "#171c17",
        },
        coral: {
          50: "#fff5f3",
          100: "#ffe8e3",
          200: "#ffd1c7",
          300: "#ffbaab",
          400: "#ffa38f",
          500: "#ff8c73",
          600: "#ff7557",
          700: "#ff5e3b",
          800: "#ff471f",
          900: "#e63003",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: "#144663",
            foreground: "#ffffff",
          },
          secondary: {
            DEFAULT: "#FBF8EB",
            foreground: "#144663",
          },
          success: {
            DEFAULT: "#6b8e6b",
            foreground: "#ffffff",
          },
          warning: {
            DEFAULT: "#f59e0b",
            foreground: "#ffffff",
          },
          danger: {
            DEFAULT: "#ff5e3b",
            foreground: "#ffffff",
          },
          background: "#FBF8EB",
          foreground: "#144663",
          focus: "#144663",
          default: {
            50: "#fafafa",
            100: "#f5f5f5",
            200: "#e5e5e5",
            300: "#d4d4d4",
            400: "#a3a3a3",
            500: "#737373",
            600: "#525252",
            700: "#404040",
            800: "#262626",
            900: "#171717",
          },
        },
      },
      dark: {
        colors: {
          primary: {
            DEFAULT: "#6699b7",
            foreground: "#ffffff",
          },
          secondary: {
            DEFAULT: "#f3ebcb",
            foreground: "#144663",
          },
          background: "#0c2d41",
          foreground: "#FBF8EB",
          focus: "#6699b7",
        },
      },
    },
  })],
};