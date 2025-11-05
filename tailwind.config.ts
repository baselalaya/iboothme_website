import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // iBoothme Brand Colors
        "brand-dark-violet": "var(--brand-dark-violet)",
        "brand-white": "var(--brand-white)",
        "brand-light-pink": "var(--brand-light-pink)",
        "dark-violet": "var(--dark-violet)",
        "light-pink": "var(--light-pink)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        display: ["var(--font-display)"],
        body: ["var(--font-sans)"],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      backdropBlur: {
        '4xl': '72px',
        '5xl': '96px',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        'float-sophisticated': {
          '0%, 100%': { 
            transform: 'translateY(0px) rotateZ(0deg) scale(1)' 
          },
          '25%': { 
            transform: 'translateY(-15px) rotateZ(1deg) scale(1.02)' 
          },
          '50%': { 
            transform: 'translateY(-30px) rotateZ(0deg) scale(1)' 
          },
          '75%': { 
            transform: 'translateY(-15px) rotateZ(-1deg) scale(0.98)' 
          },
        },
        'glow-intense': {
          '0%': { 
            boxShadow: '0 0 40px hsl(270 100% 70% / 0.3), 0 0 80px hsl(270 100% 70% / 0.1)',
            filter: 'brightness(1) saturate(100%)'
          },
          '100%': { 
            boxShadow: '0 0 40px hsl(200 100% 60% / 0.3), 0 0 80px hsl(200 100% 60% / 0.1)',
            filter: 'brightness(1.3) saturate(150%)'
          },
        },
        'holographic-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '25%': { backgroundPosition: '100% 50%' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0% 100%' },
        },
        'marquee-smooth': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'counter-cinematic': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(40px) scale(0.8) rotateX(90deg)' 
          },
          '50%': { 
            opacity: '0.8', 
            transform: 'translateY(-10px) scale(1.1) rotateX(0deg)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0px) scale(1) rotateX(0deg)' 
          },
        },
        'particle-galaxy': {
          '0%': { 
            transform: 'translateY(100vh) translateX(0px) rotateZ(0deg) scale(0)', 
            opacity: '0' 
          },
          '5%': { 
            opacity: '1', 
            transform: 'translateY(95vh) translateX(10px) rotateZ(45deg) scale(1)' 
          },
          '95%': { 
            opacity: '1', 
            transform: 'translateY(-5vh) translateX(90px) rotateZ(315deg) scale(1)' 
          },
          '100%': { 
            transform: 'translateY(-10vh) translateX(100px) rotateZ(360deg) scale(0)', 
            opacity: '0' 
          },
        },
        'spin-cinematic': {
          '0%': { transform: 'rotateY(0deg) rotateX(0deg)' },
          '25%': { transform: 'rotateY(90deg) rotateX(5deg)' },
          '50%': { transform: 'rotateY(180deg) rotateX(0deg)' },
          '75%': { transform: 'rotateY(270deg) rotateX(-5deg)' },
          '100%': { transform: 'rotateY(360deg) rotateX(0deg)' },
        },
        'morph': {
          '0%, 100%': { 
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            transform: 'scale(1) rotateZ(0deg)'
          },
          '25%': { 
            borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
            transform: 'scale(1.05) rotateZ(90deg)'
          },
          '50%': { 
            borderRadius: '50% 60% 30% 60% / 60% 30% 60% 40%',
            transform: 'scale(0.95) rotateZ(180deg)'
          },
          '75%': { 
            borderRadius: '60% 40% 60% 30% / 40% 70% 40% 50%',
            transform: 'scale(1.02) rotateZ(270deg)'
          },
        },
        'pulse-neon': {
          '0%': { 
            opacity: '0.8',
            filter: 'hue-rotate(0deg) brightness(1)'
          },
          '100%': { 
            opacity: '1',
            filter: 'hue-rotate(90deg) brightness(1.4)'
          },
        },
        'reveal-cinematic': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(100px) rotateX(90deg) scale(0.8)',
            filter: 'blur(20px)'
          },
          '60%': { 
            opacity: '0.8',
            transform: 'translateY(-20px) rotateX(0deg) scale(1.05)',
            filter: 'blur(5px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0px) rotateX(0deg) scale(1)',
            filter: 'blur(0px)'
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'float-sophisticated': 'float-sophisticated 8s ease-in-out infinite',
        'brand-glow-pulse': 'brand-glow-pulse 3s ease-in-out infinite alternate',
        'brand-gradient': 'brand-gradient-shift 4s ease-in-out infinite',
        'marquee-smooth': 'marquee-smooth 40s linear infinite',
        'counter-cinematic': 'counter-cinematic 2.5s cubic-bezier(0.19, 1, 0.22, 1)',
        'particle-galaxy': 'particle-galaxy 12s linear infinite',
        'spin-cinematic': 'spin-cinematic 20s linear infinite',
        'morph': 'morph 15s ease-in-out infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'reveal-cinematic': 'reveal-cinematic 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
