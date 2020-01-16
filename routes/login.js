const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

router.get('/', async function (req, res) {
  res.render('login', {
    title: 'Login',
    'section-slug': 'login-page',
    'hide-header': true,
    'hide-footer': true
  });
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/app',
  failureRedirect: '/login'
}), function(req, res) {
});

router.get('/logout', async function (req, res) {
  req.logout();
  res.redirect('/login');
});

router.get('/admin', function (req, res) {
  const adminJSON = new User(require("../models/admin-user.json"));
  adminJSON.save(function (err, user) {
    if (err) return console.error(err);
  });

  res.redirect('/login');
});

module.exports = router;