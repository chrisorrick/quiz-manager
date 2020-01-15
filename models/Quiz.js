const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OptionsSchema = new Schema({
  option: {
    type: String,
    required: true,
  },
  answer: {
    type: Boolean
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const QuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [ OptionsSchema ]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const QuizSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  questions: [ QuestionSchema ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Quiz", QuizSchema);