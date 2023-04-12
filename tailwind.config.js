/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./App.{js,jsx,ts,tsx,html}', './src/**/*.{js,jsx,ts,tsx, html}'],
	theme: {
		extend: {
			colors: {
				primary: '#fdc620',
				secondary: '#ebebeb',
				text_dark: '#2E2F3C',
				text_light: '#FEFFFF',
			},
		},
	},
	plugins: [],
};
