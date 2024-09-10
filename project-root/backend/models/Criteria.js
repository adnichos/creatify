const mongoose = require('mongoose');

// Definir el esquema para los criterios de validación de creatividades
const CriteriaSchema = new mongoose.Schema({
    media: { 
        type: String, 
        required: true 
    },  // Nombre del medio (ej. La Vanguardia)
    position: { 
        type: String, 
        required: true 
    },  // Nombre de la posición (ej. Roba)
    deviceType: { 
        type: String, 
        enum: ['mobile', 'desktop'], 
        required: true 
    },  // Tipo de dispositivo
    maxWeight: { 
        type: Number, 
        required: true 
    },  // Peso máximo en kilobytes (ej. 49KB)
    width: { 
        type: Number, 
        required: true 
    },  // Ancho en píxeles (ej. 300)
    height: { 
        type: Number, 
        required: true 
    },  // Alto en píxeles (ej. 600)
});

module.exports = mongoose.model('Criteria', CriteriaSchema);
