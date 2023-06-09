/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6848',
        secondary: '#FD1414',
        'secondary-1': '#FD1414',
        'secondary-2': '#F8E1E1',
        'secondary-3': '#CC3A3A',
        'secondary-4': '#FFF1F1',
        black: '#1A1A1A',
        'gray-2': '#606060',
        'gray-3': '#F8F8F8',
        theme1: {
          header: '#bee2ff',
          sidebar: '#2076c5',
          content: '#7fc2ff',
        },
        theme2: {
          header: '#101322',
          sidebar: '#101322',
          content: '#232733',
        },
        theme3: {
          header: '#ffdda7',
          sidebar: '#ffe6ca',
          content: '#fdfdfd',
        },
      },
      fontSize: {
        xxs: '10px',
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '1.125rem',
        xl: '20px',
      },
    },
  },
  plugins: [],
  //拉高tailwind的權重
  // https://tailwindcss.com/docs/configuration#important
  important: '#body',
}
