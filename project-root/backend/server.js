    const express = require('express');
    const conectarDB = require('./config/db');
    const dotenv = require('dotenv');
    const creativityRoutes = require('./routes/creativity');
    const criteriaRoutes = require('./routes/criteria');

    // Cargar las variables de entorno
    dotenv.config();

    // Inicializar la aplicación de Express
    const app = express();

    // Conectar a la base de datos
    conectarDB();

    // Middleware para parsear JSON
    app.use(express.json());

    // Importar las rutas de autenticación
    const authRoutes = require('./routes/auth');

    // Usar las rutas con el prefijo /api/auth
    app.use('/api/auth', authRoutes);

    // Usar las rutas de creatividad con el prefijo /api
    app.use('/api', creativityRoutes); 

    app.use('/api', criteriaRoutes);  // Usamos el prefijo /api para las rutas

    // Escuchar el puerto
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
