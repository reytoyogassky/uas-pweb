/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [""],
  },
  theme: {
    extend: {
      colors: {
        primary:"#234e71",
        secondary:"#63d2b2",
        third: "#feb4a9"

      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
};
