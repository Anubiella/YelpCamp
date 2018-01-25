const express = require('express');
let router = express.Router();
let User = require('../models/user');
let passport = require('passport');
const mongoose = require('mongoose');

// LANDING PAGE
router.get('/', (req,res)=>{
  res.render('landing');
});

///////////////AUTH ROUTES/////////////

router.get('/register', (req, res)=>{
  res.render('register', {page: 'register'});
});

router.post('/register', (req, res)=>{
  User.register(new User({_id: new mongoose.Types.ObjectId(), username: req.body.username}), req.body.password, (err, user)=>{
    if (err) {
      console.log(err);
      return res.render("register", {error: err.message});
    } else {
      passport.authenticate('local')(req, res, ()=>{
        req.flash('success', 'User signed up successfully');
        res.redirect('/campgrounds');
      });
    }
  });
});

router.get('/login', (req, res)=>{
  res.render('login', {page: 'login'});
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}), (req,res)=>{

});

router.get('/logout', (req, res)=>{
  req.logout();
  req.flash('success', 'Logout successfully!');
  res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

module.exports = router;
