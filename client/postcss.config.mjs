const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "ui-sans-serif", "system-ui"],
      },
    },
  },
};
