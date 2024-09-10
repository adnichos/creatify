const express = require('express');
const Creativity = require('../models/Creativity');
const Criteria = require('../models/Criteria');  // Modelo de criterios que almacena los datos de validación
const authenticateUser = require('../middleware/auth');
const checkRole = require('../middleware/roles');
const logActivity = require('../middleware/activityLogger'); // Importar el middleware

const router = express.Router();
// Ruta para agregar una creatividad (solo admin)
router.post('/creativity', authenticateUser, checkRole(['Admin']), async (req, res) => {
    const { name, size, height, width, agency, deviceType } = req.body;

    try {
        // Crear una nueva creatividad con el campo deviceType
        const creativity = new Creativity({ name, size, height, width, agency, deviceType });
        await creativity.save();
        res.status(201).json(creativity);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});


// Ruta para obtener todas las creatividades
router.get('/creativities', async (req, res) => {
    try {
        const creativities = await Creativity.find();
        res.json(creativities);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// Ruta para actualizar una creatividad (solo admin)
router.put('/creativity/:id', authenticateUser, checkRole(['Admin']), async (req, res) => {
    const { id } = req.params;
    const { name, size, height, width, agency } = req.body;

    try {
        // Encontrar la creatividad por su ID
        const creativity = await Creativity.findById(id);
        if (!creativity) {
            return res.status(404).json({ msg: 'Creativity not found' });
        }

        // Actualizar los campos de la creatividad
        if (name) creativity.name = name;
        if (size) creativity.size = size;
        if (height) creativity.height = height;
        if (width) creativity.width = width;
        if (agency) creativity.agency = agency;

        // Guardar los cambios
        await creativity.save();
        res.json(creativity);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// Ruta para eliminar una creatividad (solo admin)
router.delete('/creativity/:id', authenticateUser, checkRole(['Admin']), async (req, res) => {
    const { id } = req.params;

    try {
        // Encontrar y eliminar la creatividad por su ID
        const creativity = await Creativity.findByIdAndDelete(id);
        if (!creativity) {
            return res.status(404).json({ msg: 'Creativity not found' });
        }

        res.json({ msg: 'Creativity deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// Ruta para validar una creatividad
router.post('/creativity/validate', authenticateUser, async (req, res) => {
    const { media, position, deviceType, width, height, size } = req.body;
    console.log(req.body)
    try {
        // Buscar los criterios según el medio, posición y tipo de dispositivo (desktop/mobile)
        const criteria = await Criteria.findOne({ media, position, deviceType });
        console.log(criteria)
        if (!criteria) {
            return res.status(404).json({ message: 'Validation criteria not found for this media, position, and device type.' });
        }

        // Comparar ancho y alto con un margen de 10 píxeles de error
        const widthDifference = Math.abs(criteria.width - width);
        const heightDifference = Math.abs(criteria.height - height);

        // Validar ancho, alto y peso (en kilobytes)
        if (widthDifference <= 10 && heightDifference <= 10 && size <= criteria.maxWeight) {
            return res.status(200).json({ message: 'Creativity meets the validation criteria!' });
        } else {
            return res.status(400).json({ 
                message: 'Creativity does not meet the validation criteria.',
                details: {
                    widthDifference,
                    heightDifference,
                    allowedWeight: criteria.maxWeight,  // Ya está en kilobytes
                    actualWeight: size  // En kilobytes
                }
            });
        }
    } catch (error) {
        console.error('Error validating creativity:', error);
        res.status(500).send('Server error');
    }
});




module.exports = router;
