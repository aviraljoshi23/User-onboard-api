var auth = require('basic-auth');

const authMiddleware = (req, res, next) => {
    const user = auth(req);
  
    if (!user || user.name !== 'username' || user.pass !== 'password') {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="Access denied"');
      res.end('Access denied');
    } else {
      next();
    }
};

module.exports = authMiddleware;