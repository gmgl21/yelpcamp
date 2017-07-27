var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require('geocoder');

//Define escapeRegex function for search
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/gi,"\\$&");
}



//INDEX- show all campgrounds
router.get("/", function(req, res) {
  if(req.query.search && req.xhr) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');

    Campground.find({name: regex}, function(err, allCampgrounds) {
      if(err) {
        req.flash("error", "No campground found");
      } else {
        res.status(200).json(allCampgrounds);
      }
    });
  } else {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
        }else {
          if(req.xhr) {
            res.json(allCampgrounds);
          } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'});  
          }
        }
    });
  }
});

//CREATE- add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    // add data from form and add campgrounds to array
    var name = req.body.name;
    var image = req.body.image;    
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function(err, data) {
      var lat = data.results[0].geometry.location.lat;
      var lng = data.results[0].geometry.location.lng;
      var location = data.results[0].formatted_address;
      var newCampground = {name: name, image: image, description: desc, price: price, author: author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
      Campground.create(newCampground, function(err, createdCampground) {
        if(err) {
            console.log(err);
        } else {
        // Redirect to campgrounds page
            res.redirect("/campgrounds");
        }
      });
    });
});

//NEW- show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//SHOW- shows more info on one campground
router.get("/:id", function(req, res) {
 //find the campground with the id
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err) {
          console.log(err);
      } else {
          console.log(foundCampground);
          //render show template with that campground
          res.render("campgrounds/show", {campground: foundCampground});
      }
  });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if(err) {
      req.flash("error", "Campground does not exist");
    }
    res.render("campgrounds/edit", {campground: foundCampground});
  });
});

//UPDATE CAMPGROUND ROUTE

router.put("/:id", function(req, res) {
  geocoder.geocode(req.body.location, function(err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    //find and update the correct campground
    //redirect somewhere(show page)
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground) {
      if(err) {
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        req.flash("success", "Successfully updated campground!");
        res.redirect("/campgrounds/" + campground._id);
      }
    }); 
  });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwner, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground deleted");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;