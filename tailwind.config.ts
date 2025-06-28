
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom colors for our theme
				green: {
					50: '#f0f9f0', 
					100: '#dcf0dc',
					200: '#c8e6c9',
					300: '#a5d6a7',
					400: '#81c784',
					500: '#66bb6a',
					600: '#4caf50',
					700: '#43a047',
					800: '#388e3c',
					900: '#2e7d32'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				"accordion-up": {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				"float": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" }
				},
				"pulse-light": {
					"0%, 100%": { opacity: "0.4" },
					"50%": { opacity: "0.8" }
				},
				"star-twinkle": {
					"0%, 100%": { opacity: "0.7", transform: "scale(1)" },
					"50%": { opacity: "1", transform: "scale(1.2)" }
				},
				"rotate-y-180": {
					"0%": { transform: "rotateY(0deg)" },
					"100%": { transform: "rotateY(180deg)" }
				},
				"rotate-y-0": {
					"0%": { transform: "rotateY(180deg)" },
					"100%": { transform: "rotateY(0deg)" }
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"float": "float 6s ease-in-out infinite",
				"pulse-light": "pulse-light 4s ease-in-out infinite",
				"star-twinkle": "star-twinkle 3s ease-in-out infinite",
				"rotate-y-180": "rotate-y-180 0.5s ease-out forwards",
				"rotate-y-0": "rotate-y-0 0.5s ease-out forwards"
			},
			transformStyle: {
				"3d": "preserve-3d"
			},
			perspective: {
				"1000": "1000px"
			},
			backfaceVisibility: {
				"hidden": "hidden"
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
