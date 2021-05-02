var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

var config = require('./config');

const mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(process.env.MONGODB_URI || url);

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var consumerRouter = require('./routes/consumer');
var paymentRouter = require('./routes/payment');
var valueRouter = require('./routes/values')
var uploadRouter = require('./routes/upload')
var uploadFeedbackRouter = require('./routes/uploadFeedback')
var feedbackRouter = require('./routes/feedback')
var contactRouter = require('./routes/contact')
var accountRouter = require('./routes/accounts')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));

}

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use(passport.initialize());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/consumer', consumerRouter);
app.use('/payment', paymentRouter);
app.use('/values', valueRouter);
app.use('/upload',uploadRouter);
app.use('/uploadFeedback',uploadFeedbackRouter);
app.use('/feedback', feedbackRouter);
app.use('/contact', contactRouter);
app.use('/account', accountRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
