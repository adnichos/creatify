const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken'); // Importar el modelo para tokens en la lista negra

const authenticateUser = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verificar si el token está en la lista negra
        const blacklistedToken = await BlacklistedToken.findOne({ token });
        if (blacklistedToken) {
            console.log('Token is blacklisted');
            return res.status(401).json({ msg: 'Token has been blacklisted' });
        }

        // Verificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', decoded);

        // Encontrar el usuario para obtener el rol
        const user = await User.findById(decoded.userId).select('role');
        if (user) {
            console.log('User found:', user);
            req.user = {
                userId: user._id,
                role: user.role
            };
            next();
        } else {
            console.log('User not found');
            res.status(401).json({ msg: 'User not found' });
        }
    } catch (err) {
        console.log('Invalid token');
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authenticateUser;
