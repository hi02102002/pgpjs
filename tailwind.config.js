const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
      './src/app/**/*.{js,ts,jsx,tsx}',
   ],
   theme: {
      extend: {
         backgroundImage: {
            'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            'gradient-conic':
               'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
         },
      },
   },
   plugins: [
      plugin(function ({ addUtilities, addComponents, e, config }) {
         addComponents({
            '.app-container': {
               'max-width': '1024px',
               width: '100%',
               margin: '0 auto',
               padding: '0 1rem',
            },
         });
      }),
   ],
   corePlugins: {
      preflight: false, // <== disable this!
   },
};
