const mongoose = require('mongoose');

const accessTokenSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  access_token: String,
  expiry: Date,
});

const AccessToken = mongoose.model('AccessToken', accessTokenSchema);

module.exports = AccessToken;