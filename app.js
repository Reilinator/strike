const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { engine } = require('express-handlebars')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api')
const sassMiddleware = require('node-sass-middleware');
const app = express();

// view engine setup
app.set('trust proxy', 1);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/views'));
app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutDir: path.join(__dirname, '/views/layouts'),
  partialsDir: path.join(__dirname, '/views/partials'),
}));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sassMiddleware({
  src: __dirname + '/scss', // Input SCSS file
  dest: __dirname + '/public', // Output CSS file
  debug: true, // Output debugging info
  outputStyle: 'compressed' // Minify CSS output
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
