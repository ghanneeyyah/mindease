/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  extend: {
    keyframes: {
      typewriter: {
        '0%': { width: '0%' },
        '40%': { width: '100%' },
        '60%': { width: '100%' },
        '100%': { width: '0%' }
      },
      blink: {
        '50%': { borderColor: 'transparent' }
      }
    },
    animation: {
      typewriter: 'typewriter 4s steps(30) infinite',
      blink: 'blink 0.7s infinite'
    }
  },
};

export const plugins = [];
