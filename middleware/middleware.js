const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

const editPermissionCheck = (req, res, next) => {
  if(req.user.editQuiz === true) {
    return next();
  }
  res.redirect('/app');
}

module.exports = { isLoggedIn, editPermissionCheck };