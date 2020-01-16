const express = require('express');
const hbs = require('express-handlebars');
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require('body-parser');
const LocalStrategy  = require("passport-local");

const User = require("./models/User");
const indexRoute = require("./routes/index");
const loginRoute = require("./routes/login");
const appRoute = require("./routes/app");

const app = express();

app.engine('hbs', hbs({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));

app.set('view engine', 'hbs');

app.use(express.static('static'))

app.use(require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", indexRoute);
app.use("/login", loginRoute);
app.use("/app", appRoute);

mongoose.set('debug', true);
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/quiz-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const port = 3000;
app.listen(port, function () {
  console.log(`App listening on port ${port}`);
});