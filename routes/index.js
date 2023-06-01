var express = require('express');
var router = express.Router();

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

module.exports = router;
