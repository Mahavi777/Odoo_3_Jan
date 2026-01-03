import User from '../models/User.js';

export const checkRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }

      req.user.role = user.role;
      next();
    } catch (err) {
      console.error('Role check error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

