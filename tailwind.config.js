/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug'],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF',  
        secondary: '#000000', 
        accent: '#FAEBD7',   
        neutral: '#D3D3D3',  
        dark: '#708090',    
      },
    },
  },
  plugins: [],
}


