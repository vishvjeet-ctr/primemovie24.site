const User = require('../models/User');

const ensureAdmin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/admin/login');
  }
  
  User.findById(req.session.userId)
    .then(user => {
      if (!user || user.role !== 'admin') {
        req.session.destroy();
        return res.redirect('/admin/login');
      }
      req.user = user;
      next();
    })
    .catch(err => {
      console.error('Auth middleware error:', err);
      res.redirect('/admin/login');
    });
};

module.exports = { ensureAdmin };
