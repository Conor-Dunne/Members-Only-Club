var express = require('express');
var router = express.Router();

// Require controller modules.
const auth_controller = require("../controllers/auth")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/log-in', function(req, res, next){
  res.render('log-in', {title: 'Login'} )
});

router.get('/sign-up', function(req, res, next) {
  res.render('sign-up', {title: 'Sign Up'})
})

// POST request for creating a User.
router.post('/sign-up', auth_controller.register_user);

module.exports = router;
