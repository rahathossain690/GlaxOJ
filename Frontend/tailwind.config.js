module.exports = {
  darkMode: 'media',
  important: true,
  //Purging for Production is configured in PostCSS Config
  purge:{    
    content: ["./src/**/*.html", "./src/**/*.jsx", "./src/**/*.js"],
  },
  theme: {
    extend: {
      
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    }
  },
  plugins: [],
};
