const express = require('express');
const router = express.Router();

const Tokens = require('../models/Tokens');

router.get(
  '/',
  async (req, res) => {
    try {
      const tokens = await Tokens.find().sort({ "_id": -1 });
      return res.json(tokens);
    } catch (e) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
)
router.post(
  '/',
  async (req, res) => {
    const data = req.body;
    try {
      let token = new Tokens({
        ...data,
        timestamp: Date.now()
      })
      await token.save();
      token = await Tokens.find().sort({ "_id": -1 });
      return res.json(token);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
