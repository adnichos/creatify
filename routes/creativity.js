const express = require('express');
const Creativity = require('../models/Creativity');
const authenticateUser = require('../middleware/auth');
const checkRole = require('../middleware/roles');
const logActivity = require('../middleware/activityLogger'); // Importar el middleware

const router = express.Router();

// Ruta para agregar una creatividad (solo admin)
router.post('/creativity', authenticateUser, checkRole(['Admin']), async (req, res) => {
    const { name, size, height, width, agency } = req.body;

    try {
        // Crear una nueva creatividad
        const creativity = new Creativity({ name, size, height, width, agency });

        // Guardar la creatividad en la base de datos
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

module.exports = router;
