var express = require('express');
var passport = require('passport'); 
var router = express.Router();
var brainController = require('../controllers/brain');
var resetController = require('../controllers/reset');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Parts of the Human Brain' });
});

//router.get('/', brainController.getParts);
router.get('/parts', isLoggedIn, brainController.getParts);
router.get('/part/:brainpartid', brainController.getPart);
router.get('/createpart', brainController.formCreatePart);
router.post('/createpart', brainController.createPart);
router.get('/deletepart/:brainpartid', brainController.deletePart);
router.get('/updatemeaning/:brainpartid', brainController.formUpdateMeaning);
router.post('/updatemeaning/:brainpartid', brainController.updateMeaning);

router.get('/updatefunctionalities/:brainpartid', brainController.formUpdateFunctionalities);
router.post('/updatefunctionalities/:brainpartid', brainController.updateFunctionalities);

router.get('/forgot', function(req, res) {
  res.render('forgot', {
    user: req.user,
    message: req.flash('resetPassword')
  });
});

router.post('/forgot', resetController.resetPassword);

router.get('/reset/:token', resetController.useToken);

router.get('/login', function(req, res, next) {  
  res.render('login', { title: 'Login', message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {  
  res.render('signup', { title: 'Signup', message: req.flash('signupMessage') });
});

/*router.get('/profile', isLoggedIn, function(req, res) {  
  res.render('profile.ejs', { title: 'Profile', user: req.user });
});*/

router.get('/logout', function(req, res) {  
  req.logout();
  res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {  
  successRedirect: '/parts',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {  
  successRedirect: '/parts',
  failureRedirect: '/login',
  failureFlash: true,
}));

module.exports = router;

function isLoggedIn(req, res, next) { 
  if (req.isAuthenticated()){
      next();
  }
  else{
  res.redirect('/login');
  }
}
//<title><%= title %></title>