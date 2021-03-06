// all middleware goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};
 
middlewareObj.checkCampgroundOwner = function(req, res, next) {
    //is user logged in
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground) {
      if(err) {
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
          //if the user is the same user who added this campground
          if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
            next();
          } else {
              req.flash("error", "You don't have permission to do that");
              //otherwise redirect  
              res.redirect("back");
          }
      }
    });
  } else {
      req.flash("error", "You need to be logged in to do that!");
      //if not, redirect somewhere    
      res.redirect("back");
  }

}
 
middlewareObj.checkCommentOwner = function(req, res, next) {
    //is user logged in
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if(err) {
        res.redirect("back");
      } else {
          //if the user is the same user who added this comment
          if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
            next();
          } else {
              req.flash("error", "You don't have permission to do that");
              //otherwise redirect  
              res.redirect("back");
          }
      }
    });
  } else {
      req.flash("error", "You need to be logged in to do that!");
      //if not, redirect somewhere    
      res.redirect("back");
  }

}

middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You need to be logged in to do that!");
  res.redirect("/login");
}
 
module.exports = middlewareObj;