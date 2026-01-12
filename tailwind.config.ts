const config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf8eb',
          100: '#f5eccb',
          200: '#ebd999',
          300: '#dfc266',
          400: '#d4af37',
          500: '#b08d26',
          600: '#8a6b1b',
          700: '#6e5218',
          800: '#5c431a',
          900: '#4e391b',
          950: '#2d1f0d',
        },
      },
    },
  },
  plugins: [],
};

export default config;
