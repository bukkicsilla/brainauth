var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
//const xoauth2 = require('xoauth2');
var flash = require('connect-flash');  
var User = require('../models/user');

module.exports.resetPassword = function(req, res, next) {
    //console.log("reset!!!!!!!!!!!!!!!!reset");
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
          req.flash('error', 'No account with that email address exists.');
            console.log('No account with that email address exists.');
          return res.redirect('/forgot');
        }
        //console.log("before getting token");
        user.local.resetPasswordToken = token;
        user.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        console.log("ste token ", user.local.resetPasswordToken);
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
        //console.log("before smtp");
      //var smtpTransport = nodemailer.createTransport('SMTP', {
      var transport = nodemailer.createTransport(smtpTransport({
        service: 'SendGrid',
        auth: {
          //xoauth2: xoauth2.createXOAuth2Generator({
            //user: 'csilla.bukki@gmail.com',
            user: 'lunasaturni',
            /*clientId: '-' ,
            clientSecret: '-' ,
            refreshToken: '-'*/
            pass: 'Vorce166.'
          //})
        }
      }));
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
      message: ''
    });
  });
}