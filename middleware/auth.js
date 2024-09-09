const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken'); // Importar el modelo para tokens en la lista negra

const authenticateUser = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verificar si el token está en la lista negra
        const blacklistedToken = await BlacklistedToken.findOne({ token });
        if (blacklistedToken) {
            return res.status(401).json({ msg: 'Token has been blacklisted' });
        }

        // Verificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Encontrar el usuario para obtener el rol
        const user = await User.findById(decoded.userId).select('role');
        if (user) {
            req.user = {
                userId: user._id,
                role: user.role
            };
            next();
        } else {
            res.status(401).json({ msg: 'User not found' });
        }
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authenticateUser;
