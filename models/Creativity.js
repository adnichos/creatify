const mongoose = require('mongoose');

// Definir el esquema para las creatividades
const CreativitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Nombre de la creatividad
    },
    size: {
        type: Number, // Tamaño en bytes (por ejemplo, 2048 para 2MB)
        required: true
    },
    height: {
        type: Number, // Altura en píxeles
        required: true
    },
    width: {
        type: Number, // Anchura en píxeles
        required: true
    },
    agency: {
        type: String, // Agencia asociada a la creatividad (por ejemplo, "LV", "RAC1", "MD")
        required: true
    }
});

// Crear y exportar el modelo para las creatividades
module.exports = mongoose.model('Creativity', CreativitySchema);
