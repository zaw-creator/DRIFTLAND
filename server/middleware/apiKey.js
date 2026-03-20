// register-server/middleware/apiKey.js
module.exports = (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (key !== process.env.MAIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};