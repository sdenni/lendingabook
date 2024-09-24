const jwt = require('jsonwebtoken');

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'tidak memiliki access.' });
    
    jwt.verify(token, 'MYSECRETKEY', (err, user) => {
        if (err) return res.status(403).json({ message: 'kesalahan token' });
        
        req.user = user;
        next();
    });
}

// Admin Role Middleware
function adminOnly(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'tidak memiliki akses admin.' });
    }
    next();
}

module.exports = { authenticateToken, adminOnly };
