const createError = require('http-errors');
const express = require('express');
const session = require("express-session");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user")
const bcrypt = require("bcryptjs");
const compression = require("compression");
const helmet = require("helmet");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages')

const app = express();

// Load environment variables from .env file
require('dotenv').config();


// Set up mongoose connection
const mongoDb = process.env.MONGO_URL;

mongoose.connect(mongoDb, {useUnifiedTopology: true, useNewUrlParser: true});
const db= mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
db.on("open", () => {
    console.log("MongoDB connection successful");
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//Middleware
app.use(compression()); // Compress all routes
// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);

// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);


app.use(express.static("stylesheets"));

app.use(session({secret: process.env.sessionSecret, resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended: false}));
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/messages', messagesRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//User login auth 
passport.use(
  new LocalStrategy(async(username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      };
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user)
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" })
        }
      })
    } catch(err) {
      return done(err);
    };
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
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
