/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#EFE7D6',
        vellum: '#F8F2E4',
        cream: '#FCF9F0',
        manila: '#E4D7BE',
        ink: '#1A1714',
        sepia: '#5B5246',
        emeraldInk: '#1D5B3A',
        highlighter: '#D7E5C8',
        cobaltInk: '#1E4A7A',
        rustInk: '#9A2F22',
        ochreInk: '#9A7532',
      },
      fontFamily: {
        display: ['"Caveat"', 'cursive', 'Georgia', 'serif'],
        serif: ['"Caveat"', 'cursive', 'Georgia', 'serif'],
        hand: ['"Caveat"', 'cursive'],
        sans: ['"Kalam"', 'cursive', 'system-ui', 'sans-serif'],
        mono: ['"Courier Prime"', '"Courier New"', 'monospace'],
        typewriter: ['"Special Elite"', '"Courier Prime"', 'monospace'],
      },
      boxShadow: {
        paper: '0 2px 6px rgba(26, 23, 20, 0.07), 0 14px 28px rgba(26, 23, 20, 0.08)',
        paperLift: '0 6px 14px rgba(26, 23, 20, 0.09), 0 22px 44px rgba(26, 23, 20, 0.13)',
        stamp: '0 4px 12px rgba(29, 91, 58, 0.2)',
      },
    },
  },
  plugins: [],
};
