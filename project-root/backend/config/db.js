const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI);
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error de conexión: ${error.message}`);
        process.exit(1); // Detener la aplicación si hay un error de conexión
    }
};

module.exports = conectarDB;
