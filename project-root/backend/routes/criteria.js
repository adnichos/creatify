const express = require('express');
const Criteria = require('../models/Criteria');
const authenticateUser = require('../middleware/auth');
const checkRole = require('../middleware/roles'); // Asumimos que solo admins pueden agregar criterios

const router = express.Router();

// Ruta para agregar un criterio (solo admin)
router.post('/criteria', authenticateUser, checkRole(['Admin']), async (req, res) => {
    const { media, position, deviceType, maxWeight, width, height } = req.body;

    try {
        // Crear un nuevo criterio, incluyendo el deviceType (desktop o mobile)
        const newCriteria = new Criteria({ media, position, deviceType, maxWeight, width, height });

        // Guardar el criterio en la base de datos
        await newCriteria.save();

        res.status(201).json({ message: 'Criteria added successfully!', criteria: newCriteria });
    } catch (error) {
        console.error('Error adding criteria:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
