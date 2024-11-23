/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug'], // Rutas correctas para encontrar tus archivos Pug
  theme: {
    extend: {
      boxShadow: {
        '5xl': '0 10px 25px rgba(0, 0, 0, 0.3)', // Ejemplo de sombra extendida
      },
      fontFamily: {
        professional: ['Montserrat', 'sans-serif'], // Asegúrate de haber importado la fuente en tu proyecto
      },
      colors: {
        primary: '#FFFFFF',   // Blanco
        secondary: '#000000', // Negro
        accent: '#FAEBD7',    // Antique White
        neutral: '#D3D3D3',   // Gris Claro
        dark: '#708090',      // Slate Gray
        error: '#FF5252',     // Rojo brillante
      },
    },
  },
  plugins: [],
};
