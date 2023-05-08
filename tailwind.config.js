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
                secondary:  {
                    100: '#FD1414',
                    200: '#F8E1E1',
                    300: '#CC3A3A'
                  },
            },
        },
    },
    plugins: [],
};
