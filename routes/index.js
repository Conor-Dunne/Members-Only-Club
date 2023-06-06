const express = require('express');
const router = express.Router();
const passport = require("passport");


// Require controller modules.
const auth_controller = require("../controllers/auth")
const message_controller = require("../controllers/messages")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Members Club', user: req.user, });
  console.log(req.user);
});


router.get('/log-in', function(req, res, next){
  res.render('log-in', {title: 'Login'} )
});

router.get('/sign-up', function(req, res, next) {
  res.render('sign-up', {title: 'Sign Up'})
})

// POST request for creating a User.
router.post('/sign-up', auth_controller.register_user);

//POST request for log-in.
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in"
  })
);

//Log out
router.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

//Get Create Message Form
router.get('/create_message', function(req, res, next) {
  res.render('create_message', {title: 'Create message', user: req.user})
  console.log(req.user);
})

// POST request for creating a Message.
router.post('/create_message', message_controller.message_create_post);

module.exports = router;
