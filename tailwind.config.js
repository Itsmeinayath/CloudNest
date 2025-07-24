const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // You can extend your theme here if needed
    },
  },
  // This is the crucial line to add:
  darkMode: "class", 
  plugins: [],
};
export default config;
