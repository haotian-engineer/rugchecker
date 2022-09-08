const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  total: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  isMalicious: {
    type: Boolean,
    default: false
  },
  malType: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expire: '100d' },
  },
});

module.exports = mongoose.model('token', TokenSchema);
