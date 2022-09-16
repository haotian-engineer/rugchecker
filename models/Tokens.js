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
    type: Array,
    required: true
  },
  buyTax: {
    type: String,
    required: true
  },
  sellTax: {
    type: String,
    required: true
  },
  buyGasCost: {
    type: String,
    required: true
  },
  sellGasCost: {
    type: String,
    required: true
  },
  circulating: {
    type: String,
    required: true
  },
  cRate: {
    type: String,
    required: true
  },
  oRate: {
    type: String,
    required: true
  },
  currentLiquidity: {
    type: String,
    required: true
  },
  burnt: {
    type: String,
    required: true
  },
  creatorLiquidity: {
    type: String,
    required: true
  },
  score: {
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
