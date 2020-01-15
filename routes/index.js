const express = require("express");
const router = express.Router();

router.get('/', function (req, res) {
  res.render('index', {
    title: 'Home',
    text: 'Index page',
    'hide-header': true,
    'hide-footer': true
  });
});

module.exports = router;