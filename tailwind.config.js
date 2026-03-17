/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				honesty:        { light: '#99f6e4', DEFAULT: '#14b8a6', dark: '#0f766e' },
				emotionality:   { light: '#fecdd3', DEFAULT: '#f43f5e', dark: '#be123c' },
				extraversion:   { light: '#fed7aa', DEFAULT: '#f97316', dark: '#c2410c' },
				agreeableness:  { light: '#bbf7d0', DEFAULT: '#22c55e', dark: '#15803d' },
				conscientiousness: { light: '#bfdbfe', DEFAULT: '#3b82f6', dark: '#1d4ed8' },
				openness:       { light: '#ddd6fe', DEFAULT: '#8b5cf6', dark: '#6d28d9' },
			},
			fontFamily: {
				display: ['"Inter"', 'system-ui', 'sans-serif'],
			}
		}
	},
	plugins: []
};
