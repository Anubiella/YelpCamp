let middlewareObj = {};
let Campground = require('../models/campground');
let Comment = require('../models/comment');

middlewareObj.checkCampOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id, (err, foundCampground)=>{
        if (err || !foundCampground) {
          req.flash('error', 'Campground not found');
          res.redirect('back');
        } else {
          if (foundCampground.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash('error', 'Access denied, user not allowed');
            res.redirect('back');
          }
        }
      });
    } else {
      req.flash('error', 'Login first, please!');
      res.redirect('back');
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if (err || !foundComment) {
          req.flash('error', 'Comment not found!');
          res.redirect('back');
        } else {
          if (foundComment.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash('error', 'Access denied, user not allowed');
            res.redirect('back');
          }
        }
      });
    } else {
      res.redirect('back');
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please login first!');
  res.redirect('/login');
};

module.exports = middlewareObj;
