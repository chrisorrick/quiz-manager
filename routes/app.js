const express = require("express");
const User = require("../models/User");
const Quiz = require("../models/Quiz");
const middleware = require("../middleware/middleware");
const quizRoute = require("./quiz");
const router = express.Router();

router.get('/', middleware.isLoggedIn, async function (req, res) {
  const quizzes = await Quiz.find()
  .then(QuizzesReturned => QuizzesReturned)
  .catch(error => error);

  const quizzesMap = quizzes.map(quiz => {
    return {
      _id: quiz._id,
      name: quiz.name,
      noOfQuestions: `${quiz.questions.length} ${quiz.questions.length > 1 ? ' questions' : ' question'}`
    }
  });

  res.render('app/index', {
    title: 'Home',
    quizzes: quizzesMap,
    'app-page': true,
    editQuiz: req.user.editQuiz
  });
});

router.get('/create-user', [ middleware.isLoggedIn, middleware.editPermissionCheck ], function (req, res) {
  res.render('create-user', {
    title: 'Create user',
    editQuiz: req.user.editQuiz,
    'app-page': true
  });
});

router.post('/create-user', [ middleware.isLoggedIn, middleware.editPermissionCheck ], function (req, res) {
  let viewAnswers = false;
  let editQuiz = false;

  if(req.body.permissionLevel === 'view') {
    viewAnswers = true;
  }

  if(req.body.permissionLevel === 'edit') {
    viewAnswers = true;
    editQuiz = true;
  }

  User.register(
    new User({
      username: req.body.username,
      viewAnswers,
      editQuiz
    }),
    req.body.password,
    function(err) {
      if (err) {
        return res.render('create-user', {
          title: 'Create user'
        });
      }

      return res.redirect('/app');
  });
});

router.use("/quiz", quizRoute);

module.exports = router;