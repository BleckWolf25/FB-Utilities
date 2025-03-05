module.exports = {
    content: [
      './index.html',
      './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: '#1E40AF', // primary color
          secondary: '#9333EA', // secondary color
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
    darkMode: 'class', // Supports dark mode toggling
  };
  