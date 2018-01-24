const express = require('express');
let router = express.Router();
let Campground = require('../models/campground');
let Comment = require('../models/comment');
const mongoose = require('mongoose');
let middleware = require('../middleware');


router.get('/campgrounds/:id/comments/new',middleware.isLoggedIn, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if (err || !campground) {
      req.flash('error', 'Campground not found');
      res.redirect('back');
    } else {
      res.render('comments/new', {campground});
    }
  });
});

router.post('/campgrounds/:id/comments',middleware.isLoggedIn, (req,res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if (err || !campground) {
      req.flash('error', 'Campground not found');
      res.redirect('back');
    } else {
      req.body.comment._id = new mongoose.Types.ObjectId();

      Comment.create(
        {
          _id: req.body.comment._id,
          text: req.body.comment.text,
          author: {
            id: req.user._id,
            username: req.user.username
          }
        }, (err, comment)=>{
        if (err) {
          req.flash('error', 'Database issue, please reload or try later');
          res.redirect('back');
        } else {
          comment.save();
          campground.comments.push(comment._id);
          campground.save();
          req.flash('success', 'Comment posted!');
          res.redirect('/campgrounds/'+campground._id);
        }
      });
    }
  });
});

router.get('/campgrounds/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, (req, res)=>{
  Campground.findById(req.params.id, (err, campground)=>{
    if (err || !campground) {
      req.flash('error', 'Campground not found');
      res.redirect('back');
    } else {
      Comment.findById(req.params.comment_id, (err, comment)=>{
        if (err || !comment) {
          req.flash('error', 'Comment not found');
          res.redirect('back');
        } else {
          res.render('comments/edit',{campground_id: req.params.id, comment});
        }
      });
    }
  });  
});

router.put('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err, updatedComment)=>{
    if (err) {
      req.flash('error', 'Comment not found');
      res.redirect('back');
    } else {
      req.flash('success', 'Comment updated!');
      res.redirect('/campgrounds/'+req.params.id);
    }
  });
});

router.delete('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
  Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
    if (err) {
      req.flash('error', 'Comment not found');
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted!');
      res.redirect('/campgrounds/'+req.params.id);
    }
  });
});

module.exports = router;
