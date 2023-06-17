const express = require('express');
const router = express.Router();
const passport = require("passport");


// Require controller modules.
const auth_controller = require("../controllers/auth")
const message_controller = require("../controllers/messages")
const member_controller = require("../controllers/member")


/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    // Retrieve all messages from the database
    const messages = await message_controller.message_list();
    console.log(messages)
    res.render('index', { title: 'Members Club', user: req.user, messages: messages });
  } catch (err) {
    console.error(err);
    // Handle the error
    next(err);
  }
});


router.get('/log-in', function(req, res, next){
  const message = req.session.message;
  req.session.message = undefined; // Clear the session variable
  res.render('log-in', {title: 'Login', user: null, message: message} )
});

router.get('/sign-up', function(req, res, next) {
  res.render('sign-up', {title: 'Sign Up', errors: null,  user: null})
})

// POST request for creating a User.
router.post('/sign-up', auth_controller.register_user);

//POST request for log-in.
router.post("/log-in", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      const message = info.message;
      return res.render("log-in", {title: 'Login', user: null, message: message});
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});


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
router.get('/create_message', message_controller.message_create_get)

// POST request for creating a Message.
router.post('/create_message', message_controller.message_create_post);

module.exports = router;

//Get member page
router.get('/member', function(req, res, next) {
  res.render('member',  {
    title: "Become a member",
    user: req.user
  })
});

//POST request for updating member status
router.post('/member', member_controller.update_memberstatus);

router.get('/welcome' , function(req, res, next) {
  res.render('member-welcome', {
    user: req.user
  })
} )
