const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY || 'your_secret_key');
      req.user = decoded;
      next();
    } catch (err) {
      res.status(403).json({ error: 'Invalid or expired token' });
    }
};

exports.authorize = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
};