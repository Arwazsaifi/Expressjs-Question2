// middlewares/authMiddleware.js
const AccessToken = require('../models/AccessToken');

const validationAccessToken = async (req, res, next) => {
  const access_token = req.headers.authorization;

  try {
    const accessToken = await AccessToken.findOne({access_token});

    if (!accessToken) {
      return res.status(400).json({ message: 'Invalid access token' });
    }

    // Check if access token has expired
    if (accessToken.expiry < Date.now()) {
      await AccessToken.deleteOne({ access_token });
      return res.status(400).json({ message: 'Access token has expired' });
    }

    req.user= accessToken.user_id;
    next();
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error occurred' });
  }
};

module.exports = validationAccessToken;
