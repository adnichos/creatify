const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Middleware to authenticate user
const authenticateUser = require('../middleware/auth');
const { addTokenToBlacklist } = require('../middleware/tokenBlacklist');
const logActivity = require('../middleware/activityLogger'); // Importar el middleware
const Activity = require('../models/Activity'); // Importar el modelo Activity

// Middleware to check user roles
const checkRole = require('../middleware/roles');

// Route for user registration
router.post('/register', async (req, res) => {
    const { name, email, password, role, agency } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        user = new User({ name, email, password, role, agency });

        // Save user to the database
        await user.save();

        // Log user creation activity
        await logUserCreation(user.id, user.name);

        // Create JWT token
        const payload = { userId: user.id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return token
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});


// Route for user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Log user login activity
        await logUserLogin(user.id, user.name);

        // Create JWT token
        const payload = { userId: user.id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return token
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});


// Route for admin only
router.get('/admin', authenticateUser, checkRole(['Admin']), (req, res) => {
    res.json({ msg: 'Welcome, Admin.' });
});

// Route for agency users only
router.get('/agency', authenticateUser, checkRole(['Agency']), (req, res) => {
    res.json({ msg: 'Welcome, Agency user.' });
});

// Route to get all users (admin only)
router.get('/users', authenticateUser, checkRole(['Admin']), async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// Route to get user's own profile
router.get('/profile', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// Route for updating user profile (admin or own profile)
router.put('/profile', authenticateUser, logActivity, async (req, res) => {
   
    try {
        const { name, email, password, agency } = req.body;

        // Check if user exists
        let user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (agency) user.agency = agency;

        // Save updated user
        await user.save();
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// Route to get users with role 'Admin' (admin only)
router.get('/users/admins', authenticateUser, checkRole(['Admin']), async (req, res) => {
    try {
        const users = await User.find({ role: 'Admin' });
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// Route to update user (admin only)
router.put('/users/:id', authenticateUser, logActivity,checkRole(['Admin']), async (req, res) => {
    console.log('update')
    try {
        const { id } = req.params;
        const updates = req.body;
        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// Route to delete user (admin only)
router.delete('/users/:id', authenticateUser, checkRole(['Admin']), logActivity, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Registrar la actividad de eliminación
        const activityData = {
            userId: req.user.userId,
            userName: req.user.userName || 'Unknown', // Asegúrate de obtener el nombre del usuario si está disponible
            action: `DELETE /api/auth/users/${id}`,
            resourceType: 'User',
            resourceId: id,
            changes: { deleted: true },
            timestamp: new Date(),
        };
        
        console.log('Logging activity:', activityData);
        await Activity.create(activityData);

        res.json({ msg: 'User deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});


// Route to update user role (admin only)
router.put('/users/:id/role', authenticateUser, checkRole(['Admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!['Admin', 'Agency'].includes(role)) {
            return res.status(400).json({ msg: 'Invalid role' });
        }
        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// Route to logout (invalidate the token)
const BlacklistedToken = require('../models/BlacklistedToken'); // Importar el modelo para tokens en la lista negra

router.post('/logout', authenticateUser, logActivity, async (req, res) => {
    const token = req.header('x-auth-token');

    if (token) {
        try {
            // Añadir el token a la lista negra
            await BlacklistedToken.create({ token });

            // Registrar la actividad de logout
            console.log('User logged out, token blacklisted:', token);

            res.json({ msg: 'Logged out successfully' });
        } catch (error) {
            console.error('Error logging out:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    } else {
        res.status(400).json({ msg: 'No token provided' });
    }
});


// Function to log activity for user creation
const logUserCreation = async (userId, userName) => {
    const activityData = {
        userId: userId,
        userName: userName,
        action: 'POST /api/auth/register',
        resourceType: 'User',
        resourceId: userId,
        changes: {
            name: userName,
            action: 'User registration'
        },
        timestamp: new Date(),
    };

    try {
        await Activity.create(activityData);
        console.log('User creation activity logged:', activityData);
    } catch (error) {
        console.error('Error logging user creation activity:', error);
    }
};

// Function to log user login activity
const logUserLogin = async (userId, userName) => {
    const activityData = {
        userId: userId,
        userName: userName,
        action: 'POST /api/auth/login',
        resourceType: 'User',
        resourceId: userId,
        changes: {
            action: 'User login'
        },
        timestamp: new Date(),
    };

    try {
        await Activity.create(activityData);
        console.log('User login activity logged:', activityData);
    } catch (error) {
        console.error('Error logging user login activity:', error);
    }
};


// Function to log user logout activity
const logUserLogout = async (userId, userName) => {
    const activityData = {
        userId: userId,
        userName: userName,
        action: 'POST /api/auth/logout',
        resourceType: 'User',
        resourceId: userId,
        changes: {
            action: 'User logout'
        },
        timestamp: new Date(),
    };

    try {
        await Activity.create(activityData);
        console.log('User logout activity logged:', activityData);
    } catch (error) {
        console.error('Error logging user logout activity:', error);
    }
};


module.exports = router;
