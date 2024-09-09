const express = require('express');
const router = express.Router();

// Ruta de prueba
router.get('/', (req, res) => {
    res.send('API del Gestor de Creatividades funcionando');
});

module.exports = router;
