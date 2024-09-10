const revokedTokens = new Set();

const addTokenToBlacklist = (token) => {
    revokedTokens.add(token);
    console.log('Token added to blacklist:', token);  // Agrega esta línea para depurar
};

const isTokenRevoked = (token) => {
    return revokedTokens.has(token);
};

module.exports = { addTokenToBlacklist, isTokenRevoked };
