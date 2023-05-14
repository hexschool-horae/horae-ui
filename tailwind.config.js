/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
          primary: '#FF6848',
          secondary: '#FD1414',
          'secondary-2': '#F8E1E1',
          'secondary-3': '#CC3A3A',
          'secondary-4': '#FFF1F1',
          black: '#1A1A1A',
      },
    },
  },
  plugins: [],
  //拉高tailwind的權重
  // https://tailwindcss.com/docs/configuration#important
  important: "body", // 因dialog並不在#__next內導致無法使用樣式，改成body
};
