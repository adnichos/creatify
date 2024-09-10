const mongoose = require('mongoose');

const BlacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BlacklistedToken', BlacklistedTokenSchema);
