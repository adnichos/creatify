const Activity = require('../models/Activity');
const User = require('../models/User'); // Asegúrate de importar el modelo User

const logActivity = async (req, res, next) => {
    if (req.user && req.user.userId) {
        try {
            const user = await User.findById(req.user.userId);
            const activityData = {
                userId: req.user.userId,
                userName: user ? user.name : 'Unknown', // Añadir el nombre del usuario aquí
                action: req.method + ' ' + req.originalUrl,
                resourceType: req.route.path.split('/')[1],
                resourceId: req.params.id || null,
                changes: req.body,
                timestamp: new Date(),
            };

            console.log('Logging activity:', activityData);

            await Activity.create(activityData);
        } catch (error) {
            console.error('Error logging activity:', error);
        }
    } else {
        console.warn('User not authenticated or userId missing');
    }
    next();
};

module.exports = logActivity;
