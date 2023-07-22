const express = require('express');
const router = express.Router();

// GET /live - Render the live stream view
router.get('/', (req, res) => {
  res.render('liveStream');
});

module.exports = router;
