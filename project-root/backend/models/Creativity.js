const mongoose = require('mongoose');

// Definir el esquema para las creatividades
const CreativitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Nombre de la creatividad
    },
    size: {
        type: Number, // Tamaño en kilobytes
        required: true
    },
    height: {
        type: Number, // Altura en píxeles
        required: true
    },
    width: {
        type: Number, // Ancho en píxeles
        required: true
    },
    agency: {
        type: String, // Agencia asociada a la creatividad (por ejemplo, "LV", "RAC1", "MD")
        required: true
    },
    deviceType: {
        type: String,  // desktop o mobile
        required: true
    }
});

module.exports = mongoose.model('Creativity', CreativitySchema);
