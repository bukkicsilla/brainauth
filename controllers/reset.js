//Let less secure apps access your account

var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const xoauth2 = require('xoauth2');
var flash = require('connect-flash');  
var User = require('../models/user');

module.exports.forgotPassword = function(req, res, next) {

   async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
          //console.log("token ", token);
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ 'local.email': req.body.email }, function(err, user) {
        if (!user) {
            req.flash('resetPassword', 'No account with that email address exists.');
            console.log('No account with that email address exists.');
          return res.redirect('/forgot');
        }
        console.log("before getting token");
        user.local.resetPasswordToken = token;
        user.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        console.log("set token ", user.local.resetPasswordToken);
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
        console.log("before smtp");
     // var smtpTransport = nodemailer.createTransport('SMTP', {
      //var transport = nodemailer.createTransport(smtpTransport({
        console.log("login password ", process.env.GMAILPW);
      var transport = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        auth: {
          //xoauth2: xoauth2.createXOAuth2Generator({
            user: 'csilla.bukki@gmail.com',
              //user: 'Brainparts',
            //user: 'lunasaturni',
            //clientId: '795951284550-ho921dm76ifcfl82f7mgh82j97bvu778.apps.googleusercontent.com' ,
            //clientSecret: 'WJWxkMR8uQ4gEP-pkvcIZ0mR', 
            //refreshToken: user.local.resetPasswordToken
            //pass: 'Vorce166.'
            pass: process.env.GMAILPW
          //})
        }
      //}));
      });
      var mailOptions = {
        to: user.local.email,
        from: 'csilla.bukki@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transport.sendMail(mailOptions, function(err) {    
      //smtpTransport.sendMail(mailOptions, function(err) {
          //console.log("sending recovery email");
          //console.log(user.local.email);
          req.flash('resetPassword', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
}

module.exports.useToken = function(req, res) {
    console.log("req params token", req.params.token);
    console.log("req params")
  User.findOne({ 'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires': { $gt: Date.now() } }, function(err, user) {
    if (!user) {
        console.log("problem!!!");
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
      console.log("user found");
    res.render('reset', {
      user: req.user,
      message: '',
      token: req.params.token
    });
  });
}

module.exports.resetPassword = function(req, res){
    console.log("Finally new password!");
 async.waterfall([
    function(done) {
      User.findOne({ 'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires': { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            console.log("no user found?");
          req.flash('resetPassword', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if (req.body.password === req.body.confirm){  
        //user.local.password = req.body.password;
        user .local.password = user.generateHash(req.body.password);
        console.log("pw ! ", user.local.password);
        user.local.resetPasswordToken = undefined;
        user.local.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
        }//if
          else{
              message = req.flash("resetPassword", "Passwords do not match!");
              return res.redirect('back');
          }
      });
    },
    function(user, done) {
      //var smtpTransport = nodemailer.createTransport('SMTP', {
     var transport = nodemailer.createTransport({
        service: 'Gmail',
         host: 'smtp.gmail.com',
        auth: {
          user: 'csilla.bukki@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.local.email,
        from: 'csilla.bukki@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.local.email + ' has just been changed.\n'
      };
      transport.sendMail(mailOptions, function(err) {
        req.flash('resetPassword', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });   
}