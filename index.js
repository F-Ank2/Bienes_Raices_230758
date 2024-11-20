import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import generalRoutes from './routes/generalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import db from './config/db.js';

dotenv.config(); // Cargar variables de entorno

const app = express();

// Conexión a la base de datos
(async () => {
    try {
        await db.authenticate();
        await db.sync();
        console.log('Conexión correcta a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
})();

// Configuración de PUG
app.set('view engine', 'pug');
app.set('views', './Views');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('dev')); // Middleware de depuración

// Rutas
app.use('/', generalRoutes);
app.use('/auth', userRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).render('404', { titulo: 'Página no encontrada' });
});

// Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`La aplicación ha iniciado en el puerto: ${port}`);
});
