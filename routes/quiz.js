const express = require("express");
const Quiz = require("../models/Quiz");
const middleware = require("../middleware/middleware");
const router = express.Router();

const quizReturned = (currentQuiz, showNumbers = false) => {
  return {
    _id: currentQuiz._id,
    name: currentQuiz.name,
    date: currentQuiz.date,
    questions: currentQuiz.questions.map((currentQuestion, index) => {
      return {
        _id: currentQuestion._id,
        question: showNumbers ? `${index+1}) ${currentQuestion.question}` : currentQuestion.question,
        date: currentQuestion.date,
        optionCount: currentQuestion.options.length,
        editShowDeleteBtn: currentQuestion.options.length > 3 ? true : false,
        options: currentQuestion.options.map(currentOption => {
          return {
            _id: currentOption._id,
            option: currentOption.option,
            answer: currentOption.answer,
            date: currentOption.date
          }
        })
      } 
    })
  }
}

router.get('/create', middleware.isLoggedIn, function (req, res) {
  res.render('quiz/create', {
    title: 'Create quiz',
    editQuiz: req.user.editQuiz,
    'app-page': true
  });
});

router.post('/create', middleware.isLoggedIn, function (req, res) {
  let quizToSave = {
    name: req.body.name,
    questions: []
  };

  for(const [questionIndex, question] of req.body.question.entries()) {
    quizToSave = {
      ...quizToSave,
      questions: [
        ...quizToSave.questions,
        {
          question,
          options: []
        }
      ]
    }
  
    for(const [optionIndex, option] of req.body.option[questionIndex].entries()) {
      let answer = false;
      for(const currentAnswer of req.body.answer[questionIndex]){
        if(currentAnswer == optionIndex) {
          answer = true;
        }
      }

      quizToSave.questions[questionIndex].options = [
        ...quizToSave.questions[questionIndex].options,
        {
          option,
          answer
        }
      ]
    }
  }

  new Quiz(quizToSave).save()
  .then(savedQuiz => res.redirect(`/app/quiz/view/${savedQuiz.id}`))
  .catch(err => console.log(err));
});

router.get('/view/:id', middleware.isLoggedIn, async function (req, res) {
  let currentQuiz = await Quiz.findOne({_id: req.params.id})
  .then(quizReturned => quizReturned)
  .catch(error => error);

  currentQuiz = quizReturned(currentQuiz, true);

  res.render('quiz/view', {
    title: currentQuiz.name,
    quiz: currentQuiz,
    viewAnswers: req.user.viewAnswers,
    editQuiz: req.user.editQuiz,
    'app-page': true
  });
});

router.get('/edit/:id', [ middleware.isLoggedIn, middleware.editPermissionCheck ], async function (req, res) {
  let currentQuiz = await Quiz.findOne({_id: req.params.id})
  .then(quizReturned => quizReturned)
  .catch(error => error);

  currentQuiz = quizReturned(currentQuiz);

  res.render('quiz/edit', {
    title: currentQuiz.name,
    quiz: currentQuiz,
    editQuiz: req.user.editQuiz,
    'app-page': true
  });
});

router.post('/edit/:id', [ middleware.isLoggedIn, middleware.editPermissionCheck ], function (req, res) {
  let quizToSave = {
    _id: req.params.id,
    name: req.body.name,
    questions: []
  };

  for(const [questionIndex, question] of req.body.question.entries()) {
    quizToSave = {
      ...quizToSave,
      questions: [
        ...quizToSave.questions,
        {
          question,
          options: []
        }
      ]
    }
  
    for(const [optionIndex, option] of req.body.option[questionIndex].entries()) {
      let answer = false;
      for(const currentAnswer of req.body.answer[questionIndex]){
        if(currentAnswer == optionIndex) {
          answer = true;
        }
      }
      

      quizToSave.questions[questionIndex].options = [
        ...quizToSave.questions[questionIndex].options,
        {
          option,
          answer
        }
      ]
    }
  }

  Quiz.updateOne({ _id: quizToSave._id }, { $set: quizToSave })
  .then(savedQuiz => res.redirect(`/app/quiz/view/${quizToSave._id}`))
  .catch(err => console.log(err));
});

module.exports = router;
