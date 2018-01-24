const express = require('express');
let router = express.Router();
let Campground = require('../models/campground');
const mongoose = require('mongoose');
let middleware = require('../middleware');

router.get('/campgrounds', (req,res)=>{
  Campground.find({}, (err, campgrounds)=>{
    if (err){
      console.log(err);
    } else {
        res.render('campgrounds/index', {campgrounds, currentUser: req.user});
    }
  });
});

router.get('/campgrounds/new',middleware.isLoggedIn,(req,res)=>{
  res.render('campgrounds/new');
});

router.post('/campgrounds',middleware.isLoggedIn,(req,res)=>{
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  let price = req.body.price;
  let campId = new mongoose.Types.ObjectId();
  let newCamp = {_id:campId, name, image, description, price, author: {
    id: req.user._id,
    username: req.user.username
  }};
  Campground.create(newCamp, (err, newCampground)=>{
    if (err) {
      console.log(err);
    } else {
        res.redirect('/campgrounds');
    }
  });
});

router.get('/campgrounds/:id', (req,res)=>{
  Campground.findOne({ _id: req.params.id}).populate('comments').exec((err, foundCampground)=>{
    if (err || !foundCampground) {
      req.flash('error', 'Campground not found');
      res.redirect('back');
    } else {
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

router.get('/campgrounds/:id/edit', middleware.checkCampOwnership, (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
      if (err) {
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
      } else {
        res.render('campgrounds/edit', {campground: foundCampground});
      }
    });
});

router.put('/campgrounds/:id', middleware.checkCampOwnership, (req, res)=>{
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp)=>{
    if (err) {
      req.flash('error', 'Campground not found');
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/'+req.params.id);
    }
  });
});

router.delete('/campgrounds/:id', middleware.checkCampOwnership, (req, res)=>{
  Campground.findByIdAndRemove(req.params.id, (err)=>{
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
