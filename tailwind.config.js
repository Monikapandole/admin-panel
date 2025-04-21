/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          quicksand: ['Quicksand', 'sans-serif'],
          rubik:['Rubik'],
          chivo:['Chivo'],
          plusJakartaSans:['Plus Jakarta Sans'],
          inter: ["Inter", "sans-serif"],
        },
        spacing: {
          '47': '47rem', // Ensure this is correctly defined
        },
        fontSize: {
          'h4': ['28px', { lineHeight: '39.2px' }],
        },
        // maxWidth: {
        //   'screen-xl': '1440px',
        // },
        lineHeight: {
          h3Custom: '46.2px',
        },
        fontSize: {
          h3Custom: '33px',
        },
        screens: {
          'ipad-pro': '1024px', // Add this for iPad Pro
          'xl': '1280px',
          'xxl': '1556px',
          "ipad-sum":'686px'
        },
        boxShadow: {
          'custom-lg': '0 10px 15px 6px #0000001a, 0 16px 53px 16px #0000001a',
          "custom": '0 10px 15px -3px #0000001a, 0 4px 6px 2px #0000001a',
  
        },
        corePlugins: {
          preflight: false, // Prevents browser inconsistencies
        },
        backgroundImage: {
          'custom-blue-gradient': 'linear-gradient(to bottom right,rgb(6, 102, 158) 0,rgb(12, 49, 84) 100%,rgb(23, 23, 43) 100%)',
        },
        
      },
  
  
      animation: {
        gradient: "gradient 15s ease infinite",
        wave: "wave 10s linear infinite",
        waveReverse: "wave 18s linear reverse infinite",
        waveSlow: "wave 20s linear reverse infinite",
      },
      keyframes: {
        gradient: {
          "0%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
        wave: {
          "2%": { transform: "translateX(1%)" },
          "25%": { transform: "translateX(-25%)" },
          "50%": { transform: "translateX(-50%)" },
          "75%": { transform: "translateX(-25%)" },
          "100%": { transform: "translateX(1%)" },
        },
      },
      backgroundSize: {
        "400%": "400% 400%",
      },
    },
    plugins: [],
    safelist: [
      'bg-pink-500',
      'bg-purple-600',
      'bg-blue-500'
    ],
  }